import { Routes } from '@angular/router';
import { ListNewsComponent } from 'src/app/components/teacher/list-news/list-news.component';
import { DashboardComponent } from 'src/app/components/teacher/dashboard/dashboard.component';
import { ListStudentComponent } from 'src/app/components/teacher/list-student/list-student.component';
import { TeacherGuard } from 'src/app/auth/teacher.guard';

export const TeacherLayoutRoutes: Routes = [
    { path: '', redirectTo: 'list-news', pathMatch: 'full' },
    { path: 'list-news', component: ListNewsComponent ,canActivate: [TeacherGuard]},
    { path: 'dashboard', component: DashboardComponent,canActivate: [TeacherGuard]},
    { path: 'list-student', component: ListStudentComponent,canActivate: [TeacherGuard]}
];
