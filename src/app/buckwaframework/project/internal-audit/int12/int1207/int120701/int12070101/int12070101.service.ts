import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Utils } from "helpers/utils";
import * as moment from 'moment';
import { ComboBox } from 'models/combobox.model';

declare var $: any;
const URL = {
  SAVE: "ia/int061101/save",
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId",
  AUTH_LOGIN: "ia/int061101/getAuthLogin",
  UPLOAD: "ia/int061101/upload"
  // AUTH_LOGIN: "/restful/versionProgramByPageCode"
};

@Injectable()
export class Int12070101Service {
  fileUpload: any = [];
  readDtl: any = [];

  constructor(
    private ajax: AjaxService,
    private msg: MessageBarService,
    private router: Router
  ) { }

  // getUserLogin = () => {
  //   return new Promise<any>((resolve, reject) => {
  //     this.ajax.post(URL.AUTH_LOGIN, {}, res => {
  //       resolve(res.json());
  //     }),
  //       error => {
  //         reject(error);
  //       };
  //   });
  // };

  dropdown = (type: string, id?: number): Observable<any> => {
    const DATA = { type: type, lovIdMaster: id || null };
    return new Observable<ComboBox[]>(obs => {
      this.ajax
        .post(URL.DROPDOWN, DATA, res => {
          this[type] = res.json();
        })
        .then(() => {
          obs.next(this[type]);
        });
    });
  };

  save(formData: any, cbLoading: Function) {
    let promise1 = new Promise<any>((resolve, reject) => {
      this.ajax.post(URL.SAVE, formData, res => {
        resolve(res.json());
      }),
        error => {
          reject(this.msg.errorModal("ไม่สามารถบันทึกได้"));
          cbLoading(false);
        };
    });

    promise1.then(returnForm => {
      if (Utils.isNotNull(returnForm.rentHouseId)) {
        let execelFiles = new FormData();
        execelFiles.append("type", "RH");
        execelFiles.append("rentHouseId", returnForm.rentHouseId);
        /**
         * loop get file
         */
        this.fileUpload.forEach(file => {
          execelFiles.append("files", file.inputFIle.files[0]);
        });
        let _receipts = formData.receiptsRH;
        for (let key in _receipts) {
          _receipts[key].id = returnForm.rentHouseId;
          _receipts[key].receiptDate = moment(_receipts[key].receiptDate, "DD/MM/YYYY").toDate();
          _receipts[key].receiptType = "RH";
        }
        this.ajax.upload(URL.UPLOAD, execelFiles, res => {
          const urlReceipt = "ia/int061102/receipt/save";
          this.ajax.post(urlReceipt, _receipts, response => {
            this.msg.successModal(response.json().messageTh);
            cbLoading(false);
            this.router.navigate(["/int06/11"]);
          }).catch(err => {
            this.msg.errorModal("ไม่สามารถทำการบันทึกได้");
            console.error(err);
          });
        }).catch(err => {
          this.msg.errorModal("ไม่สามารถทำการบันทึกได้");
          console.error(err);
        }),
          error => {
            this.msg.errorModal("ไม่สามารถบันทึกได้");
            cbLoading(false);
          };
      }
    });
  }

  onUpload() {
    let inputTypeFile = `<input type="file" name="files" id="files" accept=".pdf, image/*, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                    application/vnd.ms-excel,.doc,.docx">`;

    let f = $(".upload-panel > input")[0];
    $(".upload-panel").html(inputTypeFile); //add to html

    let lastText = f.value.split("\\").length;
    let u = {
      name: f.value.split("\\")[lastText - 1],
      // type: f.type,
      // size: f.size,
      // value: f.value,
      date: new Date().toLocaleDateString(),
      typePage: "RH",
      inputFIle: f
    };
    this.fileUpload.push(u);

    return new Promise<any>((resolve, reject) => {
      resolve(this.fileUpload);
    });
  }

  onDel(index: number) {
    this.fileUpload.splice(index, 1);
  }
}
