import { registerLocaleData } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import localeThExtra from "@angular/common/locales/extra/th";
import localeTh from "@angular/common/locales/th";
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "src/environments/environment";
import { AngularMaterialModule } from "./angular-material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AddEditCareerDialogComponent } from "./components/admin/list-career/dialog/add-edit-career-dialog/add-edit-career-dialog.component";
import { AddUniversityDialogComponent } from "./components/admin/list-university/dialog/add-university-dialog/add-university-dialog.component";
import { AddUserDialogComponent } from "./components/admin/list-user/dialog/add-user-dialog/add-user-dialog.component";
import { AddEditFacultyDialogComponent } from "./components/admin/view-university/dialog/add-edit-faculty-dialog/add-edit-faculty-dialog.component";
import { AddMajorDialogComponent } from "./components/admin/view-university/dialog/add-major-dialog/add-major-dialog.component";
import { EditUniversityDialogComponent } from "./components/admin/view-university/dialog/edit-university-dialog/edit-university-dialog.component";
import { EditMajorComponent } from "./components/admin/view-university/dialog/list-major-dialog/dialog/edit-major/edit-major.component";
import { EditTcasMajorContentComponent } from "./components/admin/view-university/dialog/list-major-dialog/dialog/edit-tcas/edit-tcas-major/edit-tcas-major-content/edit-tcas-major-content.component";
import { EditTcasMajorComponent } from "./components/admin/view-university/dialog/list-major-dialog/dialog/edit-tcas/edit-tcas-major/edit-tcas-major.component";
import { ListMajorTcasComponent } from "./components/admin/view-university/dialog/list-major-dialog/dialog/list-tcas/list-major-tcas/list-major-tcas.component";
import { ListMajorAdminDialogComponent } from "./components/admin/view-university/dialog/list-major-dialog/list-major-dialog.component";
import { LogoutComponent } from "./components/logout/logout.component";
import { ComponentsModule } from "./components/navigation/components.module";
import { AddEditNewsDialogComponent } from "./components/teacher/list-news/dialog/add-edit-news-dialog/add-edit-news-dialog.component";
import { AddStudentDialogComponent } from "./components/teacher/list-student/dialog/add-student-dialog/add-student-dialog.component";
import { ListMajorTeacherDialogComponent } from "./components/teacher/view-university/dialog/list-major-dialog/list-major-dialog.component";
import { ConfirmDialogComponent } from "./components/util/confirm-dialog/confirm-dialog.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { TeacherLayoutComponent } from "./layouts/teacher-layout/teacher-layout.component";
import { UserLayoutComponent } from "./layouts/user-layout/user-layout.component";
import { LoginService } from "./services/login-service/login.service";
import { SharedModule } from "./shared/shared.module";
import { ViewMajorTcasComponent } from "./components/admin/view-university/dialog/list-major-dialog/dialog/list-tcas/list-major-tcas/dialog/view-tcas/view-major-tcas/view-major-tcas.component";

registerLocaleData(localeTh, "th-TH", localeThExtra);
@NgModule({
  declarations: [
    AppComponent,
    UserLayoutComponent,
    AdminLayoutComponent,
    TeacherLayoutComponent,
    AddEditFacultyDialogComponent,
    AddUniversityDialogComponent,
    AddMajorDialogComponent,
    EditUniversityDialogComponent,
    AddUserDialogComponent,
    AddEditNewsDialogComponent,
    ListMajorAdminDialogComponent,
    ListMajorTeacherDialogComponent,
    LogoutComponent,
    ConfirmDialogComponent,
    AddStudentDialogComponent,
    EditMajorComponent,
    AddEditCareerDialogComponent,
    EditTcasMajorComponent,
    EditTcasMajorContentComponent,
    ListMajorTcasComponent,
    ViewMajorTcasComponent,
  ],
  entryComponents: [
    AddEditFacultyDialogComponent,
    AddUniversityDialogComponent,
    AddMajorDialogComponent,
    EditUniversityDialogComponent,
    AddUserDialogComponent,
    AddEditNewsDialogComponent,
    ListMajorAdminDialogComponent,
    ListMajorTeacherDialogComponent,
    ConfirmDialogComponent,
    AddStudentDialogComponent,
    EditMajorComponent,
    AddEditCareerDialogComponent,
    EditTcasMajorComponent,
    ListMajorTcasComponent,
    ViewMajorTcasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ComponentsModule,
    HttpClientModule,
    SharedModule,
    MatProgressBarModule,
  ],
  providers: [LoginService, { provide: LOCALE_ID, useValue: "th-TH" }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
