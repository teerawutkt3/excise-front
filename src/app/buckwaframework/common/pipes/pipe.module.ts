import { NgModule } from '@angular/core';
import { DateStringPipe } from '.';
import { DateStringTypePipe } from './date-string-type.pipe';
import { DecimalFormatPipe } from './decimal-format.pipe';
import { IsEmptyPipe } from './empty.pipe';
import { PhoneFormatPipe } from './phone-format.pipe';

@NgModule({
    imports: [],
    declarations: [
        DateStringPipe,
        DateStringTypePipe,
        DecimalFormatPipe,
        IsEmptyPipe,
        PhoneFormatPipe
    ],
    exports: [
        DateStringPipe,
        DateStringTypePipe,
        DecimalFormatPipe,
        IsEmptyPipe,
        PhoneFormatPipe
    ],
})
export class PipeModule { }
