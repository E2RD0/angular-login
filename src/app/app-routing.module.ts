import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import {AuthGuard} from "./guards/auth.guard";
import { LoggedGuard } from './guards/logged.guard';

const routes: Routes = [
  {path: '', component : HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component : LoginComponent, canActivate: [LoggedGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
