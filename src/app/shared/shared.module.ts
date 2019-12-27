import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from '../pipe/phone.pipe';
import { UserTypePipe } from '../pipe/user-type.pipe';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [PhonePipe, UserTypePipe],
  imports: [
    CommonModule,
    MatSortModule
  ],
  exports: [PhonePipe, UserTypePipe]
})
export class SharedModule { }
