import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Ta0202Component } from './ta0202/ta0202.component';
import { Ta0201Component } from './ta0201/ta0201.component';

const routes: Routes = [
  { path: "01", component: Ta0201Component },
  { path: "02", loadChildren: './ta0202/ta0202.module#Ta0202Module' },
  { path: "03", loadChildren: './ta0203/ta0203.module#Ta0203Module' },
  { path: "04", loadChildren: './ta0204/ta0204.module#Ta0204Module' },
  { path: "02/se02", loadChildren: './ta0202/se02/se02.module#Se02Module' },
  { path: "05", loadChildren: './ta0205/ta0205.module#Ta0205Module' },
];
@NgModule({
  declarations: [
    Ta0201Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]

})
export class Ta02Module { }
