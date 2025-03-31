import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  userInfo: any;
  loading = false;
  error = null;

  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log(this.userInfo = res.data)
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Không thể lấy thông tin người dùng';
        this.loading = false;
      }
    });
  }

  activeTab: string = 'account-info';

  user = {
    name: 'Đỗ Trung Hiếu',
    phone: '0389296703',
    email: 'trunghieudo2003@gmail.com',
    birthday: '21/03/2025',
    avatar: 'https://trungtran.vn/images/logo-user.png',
  };

  orders = [
    { id: 'ORD-2025031', date: '25/03/2025', total: '1,250,000 đ', status: 'Đã hoàn thành', statusClass: 'status-completed' },
    { id: 'ORD-2025024', date: '17/03/2025', total: '890,000 đ', status: 'Đang xử lý', statusClass: 'status-pending' },
    { id: 'ORD-2025018', date: '10/03/2025', total: '1,780,000 đ', status: 'Đã hủy', statusClass: 'status-cancelled' },
    { id: 'ORD-2025015', date: '05/03/2025', total: '650,000 đ', status: 'Đã hoàn thành', statusClass: 'status-completed' },
  ];

  changeTab(tab: string) {
    console.log('Changing tab to:', tab);
    this.activeTab = tab;
  }

  checkUpdateUser() {
    alert('Đã lưu thay đổi thông tin tài khoản!');
  }
}