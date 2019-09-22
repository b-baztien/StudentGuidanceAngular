import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { AgmCoreModule } from '@agm/core';
import { ListMajorDialog } from './components/admin/view-university/dialog/list-major-dialog';
import { AddUniversityDialogComponent } from './components/admin/list-university/dialog/add-university-dialog/add-university-dialog.component';
import { AddEditFacultyDialogComponent } from './components/admin/view-university/dialog/add-edit-faculty-dialog/add-edit-faculty-dialog.component';
import { AddMajorDialogComponent } from './components/admin/view-university/dialog/add-major-dialog/add-major-dialog.component';
import { MatStepperModule, MatAutocompleteModule, MatSelectModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    ListMajorDialog,
    AddEditFacultyDialogComponent,
    AddUniversityDialogComponent,
    AddMajorDialogComponent,
  ],
  entryComponents: [
    ListMajorDialog,
    AddEditFacultyDialogComponent,
    AddUniversityDialogComponent,
    AddMajorDialogComponent,
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB7QdE_1fl9WHwXo5srPbRbEvZqBrj8NVE',
      language: localStorage && localStorage.gml || 'th'
    }),
    AngularFirestoreModule,
    ComponentsModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatSelectModule,
    SharedModule,
  ],
  providers: [LoginService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }