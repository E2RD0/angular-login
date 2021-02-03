import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInterface } from '@app/_models';
import{AuthService} from '@app/_services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  private user: UserInterface = {
    username: "",
    password: ""
  }

  ngOnInit(): void {
  }
  onSubmit(logInForm: NgForm){
    this.messageService.clear();
    if (logInForm.valid) {
      return this.authService.loginuser(logInForm.value.email, logInForm.value.password)
      .subscribe(
      data=>{
        this.authService.setUser(data);
        this.authService.setToken(data.authKey);
        this.router.navigate(["/"]);
      },
      error=>{
        if (error.status==401) {
          this.messageService.add({severity:'error', summary:'Credenciales incorrectas', detail:''});
        }
        else{
          this.messageService.add({severity:'warn', summary:'Error al iniciar sesión', detail:''});
        }

      });
   }
   else{
     logInForm.hasError("required");
     this.messageService.add({severity:'warn', summary:'Error en los campos', detail:'Completa todos los campos'});
     return false;
   }
  }

}
