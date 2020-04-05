import { EditPasswordComponent } from "./../../components/teacher/edit-password/edit-password.component";
import { Routes } from "@angular/router";
import { ListNewsComponent } from "src/app/components/teacher/list-news/list-news.component";
import { ListStudentComponent } from "src/app/components/teacher/list-student/list-student.component";
import { TeacherGuard } from "src/app/auth/teacher.guard";
import { ListUniversityTeacherComponent } from "src/app/components/teacher/list-university/list-university.component";
import { ViewUniversityComponent } from "src/app/components/teacher/view-university/view-university.component";
import { ProfileComponent } from "src/app/components/teacher/profile/profile.component";
import { ListEntranceExamResultComponent } from "src/app/components/teacher/list-entrance-exam-result/list-entrance-exam-result/list-entrance-exam-result.component";

export const TeacherLayoutRoutes: Routes = [
  { path: "", redirectTo: "list-entrance-exam-result", pathMatch: "full" },
  {
    path: "list-entrance-exam-result",
    component: ListEntranceExamResultComponent,
    canActivate: [TeacherGuard]
  },
  {
    path: "list-student",
    component: ListStudentComponent,
    canActivate: [TeacherGuard]
  },
  {
    path: "list-news",
    component: ListNewsComponent,
    canActivate: [TeacherGuard]
  },
  {
    path: "list-university",
    component: ListUniversityTeacherComponent,
    canActivate: [TeacherGuard]
  },
  {
    path: "list-university/view-university",
    component: ViewUniversityComponent,
    canActivate: [TeacherGuard]
  },
  { path: "profile", component: ProfileComponent, canActivate: [TeacherGuard] },
  {
    path: "edit-password",
    component: EditPasswordComponent,
    canActivate: [TeacherGuard]
  }
];
