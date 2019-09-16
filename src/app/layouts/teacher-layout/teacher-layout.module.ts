import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeacherLayoutRoutes } from './teacher-layout.routing';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatCardModule,
  MatIconModule
} from '@angular/material';
import { ListUniversityComponent } from 'src/app/components/admin/list-university/list-university.component';
import { ComponentsModule } from 'src/app/components/navigation/components.module';
import { PhonePipe } from 'src/app/pipe/phone.pipe';
import { ViewUniversityComponent } from 'src/app/components/admin/view-university/view-university.component';
import { ListUserComponent } from 'src/app/components/admin/list-user/list-user.component';
@NgModule({
  declarations: [
    // ListUniversityComponent,
    // ViewUniversityComponent,
    // ListUserComponent,
    // PhonePipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TeacherLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
  ], exports: [ComponentsModule]
})

export class TeacherLayoutModule { }