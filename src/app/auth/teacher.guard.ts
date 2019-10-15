import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Login } from '../model/Login';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userData: Login = JSON.parse(localStorage.getItem('userData'))
    if (userData && userData.type) {
      if (userData.type === 'teacher') {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }
  }

}
