import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TeacherGuard } from 'src/app/auth/teacher.guard';
import { LogInComponent } from 'src/app/components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AdminGuard } from 'src/app/auth/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, {
    path: '',
    component: UserLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/user-layout/user-layout.module#UserLayoutModule'
    }]
  }, {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }],
    canActivate: [AdminGuard]
  }, {
    path: 'teacher',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/teacher-layout/teacher-layout.module#TeacherLayoutModule',
      canActivate: [TeacherGuard]
    }]
  },
  {
    path: 'logout',
    component: LogoutComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }