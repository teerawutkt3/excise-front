import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule,  } from '@angular/forms';
import { Ta020201Component } from './ta020201.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { AuthGuard } from 'services/auth-guard.service';

  
const routes: Routes = [
  { path: "", component: Ta020201Component },
  {
    path: '', component: Ta020201Component,
    children: [
      { path: "03", loadChildren: '../ta020203/ta020203.module#Ta020203Module' },
      { path: "04", loadChildren: '../ta020204/ta020204.module#Ta020204Module' },
      { path: "05", loadChildren: '../ta020205/ta020205.module#Ta020205Module' },
     // { path: "05", loadChildren: '../ta020211/ta020204.module#Ta020204Module' },
      // { path: "12", loadChildren: '../ta020212/ta020212.module#Ta020212Module' },
      // { path: "13", loadChildren: '../ta020213/ta020213.module#Ta020213Module' },
      // { path: "14", loadChildren: '../ta020214/ta020214.module#Ta020214Module' },
      // { path: "15", loadChildren: '../ta020215/ta020215.module#Ta020215Module' },
      // { path: "16", loadChildren: '../ta020216/ta020216.module#Ta020216Module' },
      // { path: "17", loadChildren: '../ta020217/ta020217.module#Ta020217Module' },
    ]
  },
];


@NgModule({
  declarations: [Ta020201Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbModule,
 
  ],
  exports: [
    RouterModule
  ]
})
export class Ta020201Module { }
