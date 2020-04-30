import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

import { Int08RoutingModule } from './int08-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'components/button/button.module';
import { ModalModule } from 'components/modal/modal.module';
import { SegmentModule } from 'components/segment/segment.module';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Int08RoutingModule,
    SharedModule,
    SharedModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    ReactiveFormsModule
  ]
})
export class Int08Module { }
