import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from '../pipe/phone.pipe';
import { UserTypePipe } from '../pipe/user-type.pipe';



@NgModule({
  declarations: [PhonePipe, UserTypePipe],
  imports: [
    CommonModule,
  ],
  exports: [PhonePipe, UserTypePipe]
})
export class SharedModule { }
