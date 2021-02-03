import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";

import{UserInterface} from "@app/_models";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  loginuser(email: string, password: string): Observable<any> {
    const url_api = "http://backdev-workflow.gesoftcorp.com/api/gesoft-workflow/login";
    return this.http
      .post<UserInterface>(
        url_api,
        { "username": email, "password": password },
        { headers: this.headers }
      )
      .pipe(map(data => data));
  }


  login(username, password){
    console.log(username);
    return username + ' ' + password;
  }
  setUser(user: UserInterface) : void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }


  setToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser() : UserInterface {
    let user_string = localStorage.getItem("currentUser");
    if (!(user_string == null || user_string == undefined)) {
      let user: UserInterface = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  logoutUser() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
  }
}
