import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { LoginService } from './services/login.service';
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
import { PhonePipe } from './pipe/phone.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatProgressSpinnerModule,
    MatProgressButtonsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ComponentsModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }