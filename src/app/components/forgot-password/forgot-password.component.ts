// forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

interface EmailDTO {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  captchaText = '';
  captchaImage = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      captcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjklmnpqrstuvwxyz23456789';
    let captchaText = '';
    for (let i = 0; i < 6; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaText = captchaText;

    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 45;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Nền
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Thêm điểm nhiễu
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      
      // Thêm đường kẻ nhiễu
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      
      // Vẽ text
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333';
      for (let i = 0; i < captchaText.length; i++) {
        const x = 30 + i * 25;
        const y = 22.5 + (Math.random() * 10 - 5);
        const rot = (Math.random() * 30 - 15) * Math.PI / 180;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
      }
      
      this.captchaImage = canvas.toDataURL('image/png');
    }
  }

  refreshCaptcha(): void {
    this.generateCaptcha();
  }

  onSubmit(): void {
    // Reset thông báo
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.forgotForm.invalid) {
      // Đánh dấu tất cả các trường là đã chạm vào để hiển thị lỗi
      Object.keys(this.forgotForm.controls).forEach(key => {
        this.forgotForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Kiểm tra captcha trước khi gửi request
    const enteredCaptcha = this.forgotForm.get('captcha')?.value;
    
    if (enteredCaptcha.toLowerCase() !== this.captchaText.toLowerCase()) {
      this.errorMessage = 'Mã xác nhận không đúng. Vui lòng thử lại.';
      this.generateCaptcha();
      return;
    }

    this.isSubmitting = true;

    // Chuẩn bị dữ liệu gửi đến API
    const emailDTO: EmailDTO = {
      email: this.forgotForm.get('email')?.value
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as const  // Xem toàn bộ response
    };

    // Gửi yêu cầu khôi phục mật khẩu đến server
    this.http.post('http://localhost:8080/users/forgot-password', emailDTO, httpOptions)
      .subscribe({
        next: (response) => {
          console.log('Success response:', response);
          this.isSubmitting = false;
          this.successMessage = 'Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn để nhận mật khẩu mới.';
          this.forgotForm.reset();
          this.generateCaptcha();
        },
        error: (error) => {
          console.log('Error response:', error);
          this.isSubmitting = false;
          
          // Nếu lỗi chứa thông báo thành công (trường hợp server trả về lỗi nhưng email đã gửi)
          if (error.error && typeof error.error === 'string' && 
             (error.error.includes('Congratulations') || 
              error.error.includes('mail has been sent') || 
              error.error.includes('success'))) {
            this.successMessage = 'Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn để nhận mật khẩu mới.';
            this.forgotForm.reset();
          } else if (error.status === 404) {
            this.errorMessage = 'Email không tồn tại trong hệ thống.';
          } else {
            this.errorMessage = 'Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.';
          }
          
          this.generateCaptcha();
        }
      });
  }
}