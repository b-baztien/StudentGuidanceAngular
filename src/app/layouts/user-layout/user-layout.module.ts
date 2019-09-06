import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from 'src/app/components/login/login.component';
import { RouterModule } from '@angular/router';
import { UserLayoutRoutes } from './user-layout.routing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule, MatDialogModule, MatCardModule, MatSnackBarModule } from '@angular/material';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [LogInComponent],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(UserLayoutRoutes),
    AngularMaterialModule,
    MatProgressSpinnerModule,
    MatProgressButtonsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatSnackBarModule,
  ],
  exports: [MatCardModule]
})
export class UserLayoutModule { }
