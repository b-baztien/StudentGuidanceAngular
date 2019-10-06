import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let userData = JSON.parse(localStorage.getItem('userData'))
      console.log(userData)
      if(userData && userData.role){
        if(userData.role === 'admin'){
          return true
        }else{
          return false
        }
      }else{
        return false;
      }
  }
  
}
