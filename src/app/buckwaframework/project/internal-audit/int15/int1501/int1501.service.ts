import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';

const URLS = {
  GROUP_CODE: "preferences/parameter/",
  UPLOAD_FILE: "ia/int15/01/upload"
}
@Injectable()
export class Int1501Service {

  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
  ) { }

  getGroupCode() {
    let promise = new Promise((resolve) => {
      this.ajax.doPost(URLS.GROUP_CODE + 'IA_TYPE_DATA', {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          // this.messageBar.successModal(res.message)
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  onUploadService = (formBody: any) => {
    this.ajax.upload(
      URLS.UPLOAD_FILE, formBody, res => {
        this.messageBar.successModal(res.json().message)
      }, err => {
        this.messageBar.errorModal(err)
      }
    )
  }

  errModalServie(message) {
    this.messageBar.errorModal(message)
  }
}
