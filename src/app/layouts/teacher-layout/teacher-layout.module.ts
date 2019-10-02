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
  MatIconModule,
  MatStepperModule,
  MatAutocompleteModule
} from '@angular/material';
import { ComponentsModule } from 'src/app/components/navigation/components.module';
import { ListNewsComponent } from 'src/app/components/teacher/list-news/list-news.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from 'src/app/components/teacher/dashboard/dashboard.component';
import { ListStudentComponent } from 'src/app/components/teacher/list-student/list-student.component';
@NgModule({
  declarations: [
    ListNewsComponent,
    DashboardComponent,
    ListStudentComponent,
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
    SharedModule,
    MatStepperModule,
    MatAutocompleteModule,
    SharedModule,
  ], exports: [ComponentsModule]
})

export class TeacherLayoutModule { }
