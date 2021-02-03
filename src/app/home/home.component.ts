import { Component, OnInit } from '@angular/core';
import { User, UserInterface } from '@app/_models';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  user: UserInterface;
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }



}
