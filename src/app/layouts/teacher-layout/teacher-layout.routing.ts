import { Routes } from '@angular/router';
import { ListNewsComponent } from 'src/app/components/teacher/list-news/list-news.component';

export const TeacherLayoutRoutes: Routes = [
    { path: '', redirectTo: 'list-news', pathMatch: 'full' },
    { path: 'list-news', component: ListNewsComponent },
];
