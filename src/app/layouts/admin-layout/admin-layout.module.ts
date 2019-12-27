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
  MatPaginatorModule,
  MatCardModule,
  MatIconModule,
  MatStepperModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatChipsModule,
  MatSortModule
} from '@angular/material';
import { ListUniversityComponent } from 'src/app/components/admin/list-university/list-university.component';
import { ComponentsModule } from 'src/app/components/navigation/components.module';
import { ViewUniversityComponent } from 'src/app/components/admin/view-university/view-university.component';
import { ListUserComponent } from 'src/app/components/admin/list-user/list-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditPasswordComponent } from 'src/app/components/admin/edit-password/edit-password.component';
import { ListCareerComponent } from 'src/app/components/admin/list-career/list-career.component';
@NgModule({
  declarations: [
    ListUniversityComponent,
    ViewUniversityComponent,
    ListCareerComponent,
    ListUserComponent,
    EditPasswordComponent,
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
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    SharedModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatChipsModule,
    MatSortModule
  ], exports: [ComponentsModule]
})

export class AdminLayoutModule { }
