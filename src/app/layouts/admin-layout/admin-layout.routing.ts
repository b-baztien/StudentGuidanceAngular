import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', },
    { path: 'dashboard', component: DashboardComponent },
];
