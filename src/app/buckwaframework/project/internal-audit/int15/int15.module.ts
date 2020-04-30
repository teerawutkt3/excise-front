import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int15RoutingModule } from './int15-routing.module';
import { Int1501Component } from './int1501/int1501.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [Int1501Component],
  imports: [
    CommonModule,
    Int15RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Int15Module { }
