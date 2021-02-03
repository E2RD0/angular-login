import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/_services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authSerivice: AuthService, private router: Router) { 
    router.events.subscribe(val => {
      this.onCheckUser();
    });
  }

  public isLogged: boolean = false;
  ngOnInit(): void {
    this.onCheckUser();
  }
  

  logout(): void{
    this.authSerivice.logoutUser();
    this.router.navigate(["/login"]);
  }

  onCheckUser(): void{
    if (this.authSerivice.getCurrentUser() ===null) {
      this.isLogged = false;
    }
    else{
      this.isLogged = true;
    }
  }

}
