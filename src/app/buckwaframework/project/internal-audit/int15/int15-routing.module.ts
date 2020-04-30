import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int1501Component } from './int1501/int1501.component';

const routes: Routes = [
  { path: "01", component: Int1501Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int15RoutingModule { }
