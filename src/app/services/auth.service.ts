import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

interface UserDTO {
  name: string;
  phone: string;
  email: string;
  password?: string;
  gender?: string;
  birthday?: string;
}

interface ChangePasswordDTO {
  confirmPassword: string;
  newPassword: string;
}

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

  updateUser(id: string, userData: UserDTO): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, userData);
  }

    changePassword(userId: string, passwordData: ChangePasswordDTO): Observable<any> {
    return this.http.put(`${this.apiURL}/change-password/${userId}`, passwordData);
  }

  isTokenValid(): Observable<boolean> {
  // Nếu không có token, trả về false ngay lập tức
  if (!this.getToken()) {
    return of(false);
  }
  
  // Thực hiện một API call nhẹ để xác thực token
  return this.http.get<any>(`${this.apiURL}/me`).pipe(
    map(response => {
      // Nếu có response thành công, token vẫn còn hiệu lực
      return true;
    }),
    catchError(error => {
      // Nếu gặp lỗi 401 hoặc 403, token đã hết hạn
      if (error.status === 401 || error.status === 403) {
        // Xóa token và tên người dùng
        this.removeToken();
        this.removeCurrentUsername();
      }
      return of(false);
    })
  );
}
}
