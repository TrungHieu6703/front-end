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
  userInfo: any;
  loading = false;
  error = null;
  orders: any[] = [];
  selectedOrder: any = null;
  showOrderDetails = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) { }
  
  ngOnInit(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('User info:', res.data);
        this.userInfo = res.data;
        this.loading = false;
        
        // Nếu có thông tin người dùng, lấy danh sách đơn hàng
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

  activeTab: string = 'account-info';

  user = {
    name: 'Đỗ Trung Hiếu',
    phone: '0389296703',
    email: 'trunghieudo2003@gmail.com',
    birthday: '21/03/2025',
    avatar: 'https://trungtran.vn/images/logo-user.png',
  };

  changeTab(tab: string) {
    console.log('Changing tab to:', tab);
    this.activeTab = tab;
    
    // Nếu chuyển sang tab quản lý đơn hàng, tải lại danh sách đơn hàng
    if (tab === 'order-management' && this.userInfo && this.userInfo.id) {
      this.loadUserOrders();
    }
  }

  // Tải danh sách đơn hàng của người dùng
  loadUserOrders() {
    this.loading = true;
    this.orderService.getUserOrders(this.userInfo.id).subscribe({
      next: (response) => {
        console.log('Orders response:', response);
        if (response && response.data) {
          this.orders = response.data;
        } else {
          this.orders = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        // this.error = 'Không thể tải danh sách đơn hàng';
        this.loading = false;
        this.orders = [];
      }
    });
  }

  // Xem chi tiết đơn hàng
  viewOrderDetails(orderId: string) {
    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (response) => {
        console.log('Order details:', response);
        if (response && response.data) {
          this.selectedOrder = response.data;
          this.showOrderDetails = true;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading order details:', err);
        // this.error = 'Không thể tải chi tiết đơn hàng';
        this.loading = false;
      }
    });
  }

  // Đóng modal chi tiết đơn hàng
  closeOrderDetails() {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  // Hủy đơn hàng
  cancelOrder(orderId: string) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      this.loading = true;
      this.orderService.cancelOrder(orderId).subscribe({
        next: (response) => {
          console.log('Cancel order response:', response);
          alert('Đơn hàng đã được hủy thành công');
          // Tải lại danh sách đơn hàng
          this.loadUserOrders();
          // Nếu đang xem chi tiết đơn hàng này, đóng modal
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.closeOrderDetails();
          }
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          alert('Không thể hủy đơn hàng, vui lòng thử lại sau');
          this.loading = false;
        }
      });
    }
  }

  // Định dạng trạng thái đơn hàng
  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Đang xử lý';
      case 'APPROVED': return 'Đã hoàn thành';
      case 'REJECTED': return 'Đã hủy';
      default: return status;
    }
  }

  // Xác định lớp CSS cho trạng thái
  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-completed';
      case 'REJECTED': return 'status-cancelled';
      default: return '';
    }
  }

  // Định dạng giá tiền
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  // Định dạng ngày tháng
  formatDate(date: string): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
  }

  checkUpdateUser() {
    alert('Đã lưu thay đổi thông tin tài khoản!');
  }
}