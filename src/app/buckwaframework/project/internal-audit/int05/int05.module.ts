import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Int0504Component } from './int0504/int0504.component';
import { Int0504adminComponent } from './int0504/int0504admin/int0504admin.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
    { path: "01", loadChildren: "./int0501/int0501.module#Int0501Module" },
    // { path: "04", component: Int0504Component},
    // { path: "04/admin", component: Int0504adminComponent},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        SharedModule
    ],
    declarations: [Int0504Component, Int0504adminComponent],
    exports: [RouterModule]
})
export class Int05Module { }