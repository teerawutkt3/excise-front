import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030424Component } from './ta030424.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ButtonFooterReportModule } from '../../button-footer-report/button-footer-report.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta030424Component }
];
@NgModule({
  declarations: [Ta030424Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonFooterReportModule
  ]
})
export class Ta030424Module { }
