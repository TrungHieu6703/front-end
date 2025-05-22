import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLogin = true; // true = Đăng nhập, false = Đăng ký

  // Hàm chuyển tab
  setTab(tab: 'login' | 'register') {
    this.isLogin = tab === 'login';
    // Reset các validation errors khi chuyển tab
    this.loginErrors = {};
    this.registerErrors = {};
  }
  userInfo: any;

  login: any = { email: '', password: '' };
  register: any = { name: '', password: '', phone: '', email: '' };
  message: string = '';
  type: string = '';
  
  // Validation errors
  loginErrors: any = {};
  registerErrors: any = {};
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.message = params['message'];
      this.type = params['type'];
    });
  }

  // Validate login form
  validateLoginForm(): boolean {
    this.loginErrors = {};
    let isValid = true;

    if (!this.login.email) {
      this.loginErrors.email = 'Vui lòng nhập email đăng nhập';
      isValid = false;
    } else if (!this.isValidEmail(this.login.email)) {
      this.loginErrors.email = 'Email không đúng định dạng';
      isValid = false;
    }

    if (!this.login.password) {
      this.loginErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (this.login.password.length < 6) {
      this.loginErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    return isValid;
  }

  // Validate register form
  validateRegisterForm(): boolean {
    this.registerErrors = {};
    let isValid = true;

    if (!this.register.name) {
      this.registerErrors.name = 'Vui lòng nhập họ và tên';
      isValid = false;
    }

    if (!this.register.phone) {
      this.registerErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!this.isValidPhone(this.register.phone)) {
      this.registerErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    if (!this.register.email) {
      this.registerErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!this.isValidEmail(this.register.email)) {
      this.registerErrors.email = 'Email không đúng định dạng';
      isValid = false;
    }

    if (!this.register.password) {
      this.registerErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (this.register.password.length < 6) {
      this.registerErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    return isValid;
  }

  // Kiểm tra email hợp lệ
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Kiểm tra số điện thoại hợp lệ (Việt Nam)
  isValidPhone(phone: string): boolean {
    // Định dạng số điện thoại Việt Nam
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
  }

  onLogin() {
    if (!this.validateLoginForm()) {
      return;
    }

    this.isSubmitting = true;
    this.authService.removeCurrentUsername();
    this.authService.removeToken();

    this.authService.login(this.login).subscribe({
      next: (response) => {
        // Lưu token và username
        this.authService.setCurrentUsername(this.login.email);
        this.authService.setToken(response.token);

        // Sau khi login, lấy thông tin người dùng
        this.authService.getCurrentUser().subscribe({
          next: (res) => {
            this.userInfo = res.data;
            // Điều hướng theo role
            if (this.userInfo.role === 'ROLE_ADMIN') {
              this.router.navigate(["/admin/dashboard"]);
            } else {
              this.router.navigate(["/designation"]);
            }
            this.isSubmitting = false;
          },
          error: (err) => {
            console.log('Lỗi khi lấy thông tin người dùng:', err);
            this.isSubmitting = false;
          }
        });
      },
      error: (error) => {
        console.log(error);
        this.message = error.error.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Đăng nhập thất bại',
          detail: 'Thông tin đăng nhập không chính xác',
          life: 3000
        });
        this.isSubmitting = false;
      }
    });
  }

  onRegister() {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.isSubmitting = true;
    this.authService.signup(this.register).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đăng ký tài khoản thành công',
          life: 3000,
        });

        // Xóa form sau khi đăng ký thành công
        this.register = { name: '', password: '', phone: '', email: '' };

        // Chuyển sang tab đăng nhập sau khi đăng ký thành công
        setTimeout(() => {
          this.setTab('login');
        }, 2000);
        this.isSubmitting = false;
      },
      error: (error) => {
        let errorMessage = 'Đã có lỗi xảy ra khi đăng ký';
        
        if (error.error && error.error.message) {
          // Xử lý lỗi cụ thể từ server
          if (error.error.message.includes('email')) {
            errorMessage = 'Email này đã được sử dụng';
            this.registerErrors.email = errorMessage;
          } else if (error.error.message.includes('phone')) {
            errorMessage = 'Số điện thoại này đã được sử dụng';
            this.registerErrors.phone = errorMessage;
          } else {
            errorMessage = error.error.message;
          }
        }
          
        this.messageService.add({
          severity: 'error',
          summary: 'Đăng ký thất bại',
          detail: errorMessage,
          life: 5000
        });
        this.isSubmitting = false;
      }
    });
  }
}