import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';

import {AuthService} from "@app/_services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(){
    if (this.authService.getCurrentUser() && this.authService.getCurrentUser()!=null) {
      this.router.navigate(['/']);
      return false;
    }
    else{
      return true;
    }
  }
  
}
