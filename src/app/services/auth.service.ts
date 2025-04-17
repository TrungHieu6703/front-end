import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = API_URL + 'users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: {email: any, password: any}): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/login`, credentials);
  }


  signup(credentials: {email: any, password: any, name: any, phone: any}): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/register`, credentials);
  }

  setToken(token: string) {
    window.localStorage.setItem("auth_token", token);
  }


  getToken(): string {
    return window.localStorage.getItem("auth_token") || '';
  }


  removeToken(): void {
    window.localStorage.removeItem("auth_token");
  }
  

  setCurrentUsername(username: string) {
    window.localStorage.setItem("current_username", username);
  }


  getCurrentUsername(): string {
    return window.localStorage.getItem("current_username") || '';
  }


  removeCurrentUsername(): void {
    window.localStorage.removeItem("current_username");
  }

  
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/me`);
  }
}
