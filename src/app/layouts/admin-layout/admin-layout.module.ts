import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';
import { ListUniversityComponent } from 'src/app/components/list-university/list-university.component';
import { ComponentsModule } from 'src/app/components/navigation/components.module';
import { PhonePipe } from 'src/app/pipe/phone.pipe';
import { ViewUniversityComponent } from 'src/app/components/view-university/view-university.component';
@NgModule({
  declarations: [
    ListUniversityComponent,
    ViewUniversityComponent,
    PhonePipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
  ], exports: [ComponentsModule]
})

export class AdminLayoutModule { }
