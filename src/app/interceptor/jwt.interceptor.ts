import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // console.log('Interceptor đang chạy...', request.method, request.url);
  
    if (request.method === 'OPTIONS') {
      console.log('Bỏ qua request OPTIONS');
      return next.handle(request);
    }
  
    const token = this.authService.getToken();
    // console.log('Token lấy từ AuthService:', token);
  
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      // console.log('Request đã thêm Authorization:', request);
    } else {
      console.warn('Không tìm thấy token!');
    }
  
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 || error.status === 401) {
          console.warn('Token hết hạn hoặc không hợp lệ! Đăng xuất người dùng...');
          
          // Xóa token khỏi localStorage
          this.authService.removeToken();  
          this.authService.removeCurrentUsername();

          // Chuyển hướng về trang đăng nhập
          this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
        }
        return throwError(error);
      })
    );
  }
}
