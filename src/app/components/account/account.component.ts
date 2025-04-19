import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  userInfo: any = {};
  loading = false;
  error: any = null;
  orders: any[] = [];
  selectedOrder: any = null;
  showOrderDetails = false;

  // For change toggles
  showChangePhone = false;
  showChangeEmail = false;
  showChangePassword = false;

  // New values
  newPhone: string = '';
  newEmail: string = '';
  newPassword: string = '';

  activeTab: string = 'account-info';

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.userInfo = res.data;
        if (!this.userInfo.gender) this.userInfo.gender = 'Nam';
        this.loading = false;
        if (this.userInfo && this.userInfo.id) {
          this.loadUserOrders();
        }
      },
      error: (err) => {
        this.error = err.message || 'Không thể lấy thông tin người dùng';
        this.loading = false;
      }
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'order-management' && this.userInfo?.id) {
      this.loadUserOrders();
    }
  }

  toggleChangePhone() {
    this.showChangePhone = !this.showChangePhone;
    if (this.showChangePhone) this.newPhone = this.userInfo.phone;
  }

  toggleChangeEmail() {
    this.showChangeEmail = !this.showChangeEmail;
    if (this.showChangeEmail) this.newEmail = this.userInfo.email;
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
    if (this.showChangePassword) this.newPassword = ''; // Không hiển thị mật khẩu đã mã hóa
  }

  saveUserChanges() {
    if (!this.userInfo.id) {
      alert('Không thể cập nhật thông tin, vui lòng đăng nhập lại!');
      return;
    }

    const userData: any = {
      name: this.userInfo.name,
      phone: this.showChangePhone ? this.newPhone : this.userInfo.phone,
      email: this.showChangeEmail ? this.newEmail : this.userInfo.email,
      password: this.showChangePassword ? this.newPassword : this.userInfo.password,
      gender: this.userInfo.gender,
      birthday: this.userInfo.birthday
    };

    // Chỉ gửi password nếu có đổi
    if (this.showChangePassword && this.newPassword.trim() !== '') {
      userData.password = this.newPassword;
    }

    this.loading = true;

    this.authService.updateUser(this.userInfo.id, userData).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.userInfo = response.data;
        }
        this.resetChangeFields();
        this.loading = false;
        alert('Đã cập nhật thông tin tài khoản thành công!');
      },
      error: (err) => {
        console.log('Dữ liệu gửi đi:', userData);
        this.loading = false;
        const errorMessage = err.error?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau!';
        alert(errorMessage);
      }
    });
  }

  resetChangeFields() {
    this.showChangePhone = false;
    this.showChangeEmail = false;
    this.showChangePassword = false;
    this.newPhone = '';
    this.newEmail = '';
    this.newPassword = '';
  }

  loadUserOrders() {
    this.loading = true;
    this.orderService.getUserOrders(this.userInfo.id).subscribe({
      next: (response) => {
        this.orders = response?.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.orders = [];
      }
    });
  }

  viewOrderDetails(orderId: string) {
    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (response) => {
        this.selectedOrder = response?.data || null;
        this.showOrderDetails = !!this.selectedOrder;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  closeOrderDetails() {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  cancelOrder(orderId: string) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      this.loading = true;
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Đơn hàng đã được hủy thành công');
          this.loadUserOrders();
          if (this.selectedOrder?.id === orderId) {
            this.closeOrderDetails();
          }
        },
        error: () => {
          alert('Không thể hủy đơn hàng, vui lòng thử lại sau');
          this.loading = false;
        }
      });
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Đang xử lý';
      case 'APPROVED': return 'Đã hoàn thành';
      case 'REJECTED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-completed';
      case 'REJECTED': return 'status-cancelled';
      default: return '';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  formatDate(date: string): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
  }
}
