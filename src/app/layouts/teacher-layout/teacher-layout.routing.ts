import { Routes } from '@angular/router';
import { ListNewsComponent } from 'src/app/components/teacher/list-news/list-news.component';
import { DashboardComponent } from 'src/app/components/teacher/dashboard/dashboard.component';
import { ListStudentComponent } from 'src/app/components/teacher/list-student/list-student.component';

export const TeacherLayoutRoutes: Routes = [
    { path: '', redirectTo: 'list-news', pathMatch: 'full' },
    { path: 'list-news', component: ListNewsComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'list-student', component: ListStudentComponent },
];
