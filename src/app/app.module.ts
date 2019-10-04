import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { LoginService } from './services/login-service/login.service';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from 'src/environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { AppRoutingModule } from './app-routing.module';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ComponentsModule } from './components/navigation/components.module';
import { AddUniversityDialogComponent } from './components/admin/list-university/dialog/add-university-dialog/add-university-dialog.component';
import { AddEditFacultyDialogComponent } from './components/admin/view-university/dialog/add-edit-faculty-dialog/add-edit-faculty-dialog.component';
import { AddMajorDialogComponent } from './components/admin/view-university/dialog/add-major-dialog/add-major-dialog.component';
import { MatStepperModule, MatAutocompleteModule, MatSelectModule, MatFormFieldModule, MatChipsModule, MatExpansionModule, MatDatepickerModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { EditUniversityDialogComponent } from './components/admin/view-university/dialog/edit-university-dialog/edit-university-dialog.component';
import { DeleteUniversityComponent } from './components/admin/view-university/dialog/delete-university-dialog/delete-university.component';
import { AddUserDialogComponent } from './components/admin/list-user/dialog/add-user-dialog/add-user-dialog.component';
import { AddNewsDialogComponent } from './components/teacher/list-news/dialog/add-news-dialog/add-news-dialog.component';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import localeThExtra from '@angular/common/locales/extra/th';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ListMajorDialogComponent } from './components/admin/view-university/dialog/list-major-dialog/list-major-dialog.component';

registerLocaleData(localeTh, 'th-TH', localeThExtra );
@NgModule({
  declarations: [
    AppComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    AddEditFacultyDialogComponent,
    AddUniversityDialogComponent,
    AddMajorDialogComponent,
    EditUniversityDialogComponent,
    DeleteUniversityComponent,
    AddUserDialogComponent,
    AddNewsDialogComponent,
    ListMajorDialogComponent,
  ],
  entryComponents: [
    AddEditFacultyDialogComponent,
    AddUniversityDialogComponent,
    AddMajorDialogComponent,
    EditUniversityDialogComponent,
    DeleteUniversityComponent,
    AddUserDialogComponent,
    AddNewsDialogComponent,
    ListMajorDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatProgressSpinnerModule,
    MatProgressButtonsModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ComponentsModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatSelectModule,
    SharedModule,
    MatFormFieldModule,
    MatChipsModule,
    MatExpansionModule,
    MatDatepickerModule,
  ],
  providers: [LoginService, { provide: LOCALE_ID, useValue: 'th-TH' }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }