import { Routes } from '@angular/router';
import { ListUniversityComponent } from 'src/app/components/admin/list-university/list-university.component';
import { ViewUniversityComponent } from 'src/app/components/admin/view-university/view-university.component';
import { ListUserComponent } from 'src/app/components/admin/list-user/list-user.component';
import { EditPasswordComponent } from 'src/app/components/admin/edit-password/edit-password.component';
import { AdminGuard } from 'src/app/auth/admin.guard';
import { ListCareerComponent } from 'src/app/components/admin/list-career/list-career.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'list-university', pathMatch: 'full' },
    { path: 'list-university', component: ListUniversityComponent, canActivate: [AdminGuard] },
    { path: 'list-university/view-university', component: ViewUniversityComponent, canActivate: [AdminGuard] },
    { path: 'list-career', component: ListCareerComponent, canActivate: [AdminGuard] },
    { path: 'list-user', component: ListUserComponent, canActivate: [AdminGuard] },
    { path: 'edit-password', component: EditPasswordComponent, canActivate: [AdminGuard] },
];
