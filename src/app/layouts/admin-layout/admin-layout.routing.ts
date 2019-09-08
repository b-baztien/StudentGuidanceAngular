import { Routes } from '@angular/router';
import { ListUniversityComponent } from 'src/app/components/list-university/list-university.component';
import { ViewUniversityComponent } from 'src/app/components/view-university/view-university.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'list-university', pathMatch: 'full' },
    { path: 'list-university', component: ListUniversityComponent },
    { path: 'list-university/view-university', component: ViewUniversityComponent },
];
