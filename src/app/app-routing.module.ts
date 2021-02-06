import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import {AuthGuard} from "./guards/auth.guard";
import { LoggedGuard } from './guards/logged.guard';
import { CrudComponent } from './crud/crud.component';
import { DataviewComponent } from './dataview/dataview.component';

const routes: Routes = [
  {path: '', component : HomeComponent, canActivate: [AuthGuard]},
  {path: 'crud', component : CrudComponent, canActivate: [AuthGuard]},
  {path: 'dataview', component : DataviewComponent, canActivate: [AuthGuard]},
  {path: 'login', component : LoginComponent, canActivate: [LoggedGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
