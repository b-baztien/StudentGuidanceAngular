import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeacherLayoutRoutes } from './teacher-layout.routing';

import { ComponentsModule } from 'src/app/components/navigation/components.module';
import { ListNewsComponent } from 'src/app/components/teacher/list-news/list-news.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListStudentComponent } from 'src/app/components/teacher/list-student/list-student.component';
import { ListUniversityTeacherComponent } from 'src/app/components/teacher/list-university/list-university.component';
import { ViewUniversityComponent } from 'src/app/components/teacher/view-university/view-university.component';
import { ProfileComponent } from 'src/app/components/teacher/profile/profile.component';
import { ListEntranceExamResultComponent } from 'src/app/components/teacher/list-entrance-exam-result/list-entrance-exam-result/list-entrance-exam-result.component';
@NgModule({
  declarations: [
    ListNewsComponent,
    ListStudentComponent,
    ListUniversityTeacherComponent,
    ViewUniversityComponent,
    ProfileComponent,
    ListEntranceExamResultComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TeacherLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ], exports: [ComponentsModule]
})

export class TeacherLayoutModule { }
