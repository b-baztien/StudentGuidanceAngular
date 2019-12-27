import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Login } from '../model/Login';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userData: Login = JSON.parse(localStorage.getItem('userData'));
    console.log(userData);
    if (userData && userData.type) {
      if (userData.type === 'admin') {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }
  }

}
