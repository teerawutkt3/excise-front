import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';


declare var $: any;
@Component({
  selector: 'app-int1106',
  templateUrl: './int1106.component.html',
  styleUrls: ['./int1106.component.css']
})
export class Int1106Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" },
    { label: "บทสรุปผู้บริหาร", route: "#" },
  ];

  show: boolean

  data1: string = `ระบบการควบคุมภายในที่ไม่เพียงพอและเหมาะสม คิดเป็นร้อยละ 28 เช่นไม่มีการสอบทานงานระหว่างกัน การมอบหมายอำนาจหน้าที่ไม่ถูกต้องครบถ้วน และไม่เป็นปัจจุบันการจัดทำทะเบียนคุมเพื่อใช้ในการสอบ ทานไม่เป็นปัจจุบัน เป็นต้น อาจส่งผลกระทบให้การปฏิบัติงานไม่มีผู้รับผิดชอบโดยตรง ไม่มีเอกสารหลักฐานที่ใช้ในการ สอบยันระหว่างกัน`
  data2: string = `ด้านบุคลากร คิดเป็นร้อยละ 35 เช่น เจ้าหน้าที่มีความรู้ความเข้าใจเกี่ยวกับกฎระเบียบข้อบังคับที่เกี่ยวข้องไม่เพียงพอเจ้าหน้าที่ ปฏิบัติงานไม่ครบถ้วน ไม่เป็นไปตามกฎระเบียบ ข้อบังคับที่เกี่ยวข้อง เจ้าหน้าที่ขาดความระมัดระวังรอบคอบในการปฏิบัติงาน เจ้าหน้าที่มีการโยกย้าย / เปลี่ยนแปลงหน้าที่ความรับผิดชอบ เจ้าหน้าที่บรรจุ ใหม่เป็นต้น อาจส่งผลกระทบให้การปฏิบัติงานไม่ถูกต้อง เกิดความเสียหายต่อส่วนราชการและต่อผู้ปฏิบัติงาน ได้ เช่นภาพลักษณ์ของส่วนราชการ การโดนโทษทางวินัย การเรียกเงินคืน ต้องปฏิบัติงานหลายครั้ง เป็นต้น`

  detail1: string = `1. ให้สำนักงานสรรพสามิตภาค/พื้นที่/พื้นที่สาขา ทบทวนระบบการควบคุมภายในให้ครอบคลุมทุกด้านเป็นประจำ และกำหนดมาตรการบทลงโทษเป็น ลายลักษณ์อักษร และประกาศให้ถือปฏิบัติอย่าง เคร่งครัด
2. สร้างความตระหนักรู้ให้เห็นถึงความสำคัญของ การมีระบบการควบคุมภายในที่ดี ที่ช่วยให้เจ้าหน้าที่ปฏิบัติงานได้อย่างมีประสิทธิภาพ เกิดความสบายใจในการทำงาน`
  detail2: string = `1. ให้สำนักงานสรรพสามิตภาค/พื้นที่/พื้นที่สาขา จัดทำ KM ภายในหน่วยงานอย่างน้อยเดือนละ 1 เรื่องเพื่อเผยแพร่ความรู้ให้กับเจ้าหน้าที่ภายในหน่วยงาน
2. ให้สำนักบริหารทรัพยากรบุคคล จัดหลักสูตร ฝึกอบรมให้ความรู้เกี่ยวกับกฎระเบียบข้อบังคับที่ เกี่ยวข้องให้เจ้าหน้าที่ผู้ปฏิบัติงานอย่างทั่วถึง
3. ให้เจ้าหน้าที่ศึกษาหาความรู้จากคู่มือหรือ แนวทางการปฏิบัติงานเพื่อให้สามารถปฏิบัติงานได้ อย่างถูกต้อง`
  show1: boolean
  show2: boolean
  constructor() { }

  ngOnInit() {
  }

  showModal(status) {
    if (status == 0) {
      this.show = true
      this.show1 = false
      this.show2 = false
    }
    else if (status == 1) {
      this.show1 = true
      this.show2 = false
      this.show = false
    } else {
      this.show2 = true
      this.show1 = false
      this.show = false
    }
    $('#detail').modal('show');
  }
}