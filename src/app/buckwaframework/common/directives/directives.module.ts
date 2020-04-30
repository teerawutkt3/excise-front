import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FieldDirective } from './forms/field.directive';
import { FieldsDirective } from './forms/fields.directive';
import { FormDirective } from './forms/form.directive';
import { InlineDirective } from './forms/inline.directive';
import { ColumnDirective } from './grid/column.directive';
import { GridDirective } from './grid/grid.directive';
import { RowDirective } from './grid/row.directive';
import { NumberFormatDirective } from './number-format.directive';
import { NumberDirective } from './number.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [
        NumberDirective,
        NumberFormatDirective,
        // FormsDirective
        FieldDirective,
        FieldsDirective,
        FormDirective,
        InlineDirective,
        // GridDirective
        GridDirective,
        RowDirective,
        ColumnDirective
    ],
    exports: [
        NumberDirective,
        NumberFormatDirective,
        // FormsDirective
        FieldDirective,
        FieldsDirective,
        FormDirective,
        InlineDirective,
        // GridDirective
        GridDirective,
        RowDirective,
        ColumnDirective
    ]
})
export class DirectivesModule { }
