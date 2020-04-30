import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Int0601Component } from './int0601.component';
import { Int060101Component } from './int060101/int060101.component';
import { Int060102Component } from './int060102/int060102.component';
import { Int060103Component } from './int060103/int060103.component';
import { Int060104Component } from './int060104/int060104.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './int0601.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


const routes: Routes = [
  {
    path: '', component: Int0601Component,
    children: [
      { path: '01', component: Int060101Component },
      { path: '02', component: Int060102Component },
      { path: '03', component: Int060103Component },
      { path: '04', component: Int060104Component }
    ]
  },
]

@NgModule({
  declarations: [
    Int0601Component,
    Int060101Component,
    Int060102Component,
    Int060103Component,
    Int060104Component
  ],
  imports: [

    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    StoreModule.forFeature('int0601', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ],
  exports: [
    RouterModule
  ]
})
export class Int0601Module { }
