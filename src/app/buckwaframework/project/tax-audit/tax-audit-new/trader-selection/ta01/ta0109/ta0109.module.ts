import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0109Component } from './ta0109.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TableCustomModule } from '../../table-custom/table-custom.module';


const routes: Routes = [
  { path: "", component: Ta0109Component },
];

@NgModule({
  declarations: [Ta0109Component],
  imports: [
    CommonModule,
    SharedModule,
    TableCustomModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],

  exports: [
    RouterModule
  ]
})
export class Ta0109Module { }
