import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int06RoutingModule } from './int06-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { Int0607Component } from './int0607/int0607.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int0608Component } from './int0608/int0608.component';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';
import { ModalModule } from 'components/modal/modal.module';
import { Int0609Component } from './int0609/int0609.component';
import { Int0611Component } from './int0611/int0611.component';
import { Int0612Component } from './int0612/int0612.component';
import { Int0613Component } from './int0613/int0613.component';
import { Int0603Component } from './int0603/int0603.component';
import { Int0600Component } from './int0600/int0600.component';
import { Int0602Component } from './int0602/int0602.component';
import { Int0604Component } from './int0604/int0604.component';


@NgModule({
  declarations: [Int0602Component, Int0607Component, Int0608Component, Int0609Component, Int0611Component, Int0612Component, Int0613Component, Int0603Component, Int0600Component, Int0604Component],
  imports: [
    CommonModule,
    Int06RoutingModule,
    FormsModule,
    SharedModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    ReactiveFormsModule
  ]
})
export class Int06Module { }
