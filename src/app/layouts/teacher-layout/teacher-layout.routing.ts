import { Routes } from '@angular/router';
import { ListNewsComponent } from 'src/app/components/teacher/list-news/list-news.component';
import { DashboardComponent } from 'src/app/components/teacher/dashboard/dashboard.component';
import { ListStudentComponent } from 'src/app/components/teacher/list-student/list-student.component';
import { TeacherGuard } from 'src/app/auth/teacher.guard';
import { ListUniversityTeacherComponent } from 'src/app/components/teacher/list-university/list-university.component';
import { ViewUniversityComponent } from 'src/app/components/teacher/view-university/view-university.component';

export const TeacherLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [TeacherGuard] },
    { path: 'list-university', component: ListUniversityTeacherComponent, canActivate: [TeacherGuard] },
    { path: 'list-university/view-university', component: ViewUniversityComponent, canActivate: [TeacherGuard]  },
    { path: 'list-news', component: ListNewsComponent, canActivate: [TeacherGuard] },
    { path: 'list-student', component: ListStudentComponent, canActivate: [TeacherGuard] }
];
