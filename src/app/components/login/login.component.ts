import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLogin = true; // true = Đăng nhập, false = Đăng ký

  // Hàm chuyển tab
  setTab(tab: 'login' | 'register') {
    this.isLogin = tab === 'login';
  }
  userInfo: any

  login: any = {email: '', password: ''};
  register: any = {name: '', password: '', phone: '', email: ''}
  message: string = '';
  type: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.message = params['message'];
      this.type = params['type'];
    })
  }

onLogin() {
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
        },
        error: (err) => {
          console.log('Lỗi khi lấy thông tin người dùng:', err);
        }
      });
    },
    error: (error) => {
      console.log(error);
      this.message = error.error.message;
    }
  });
}


  onRegister(){
    this.authService.signup(this.register).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error);
        this.message = error.error.message;
      }
    })
  }
}

