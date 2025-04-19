// order-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: any = null;
  showOrderDetails: boolean = false;
  loading: boolean = false;
  error: string | null = null;
  
  // Bộ lọc
  statusFilter: string = 'ALL';
  searchQuery: string = '';
  
  // Phân trang
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get('http://localhost:8080/orders').subscribe({
      next: (response: any) => {
        this.orders = response.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách đơn hàng:', err);
        this.error = 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    // Lọc theo trạng thái
    let filtered = this.orders;
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }
    
    // Tìm kiếm theo ID
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) || 
        (order.userId && order.userId.toLowerCase().includes(query))
      );
    }
    
    // Cập nhật danh sách đã lọc
    this.filteredOrders = filtered;
    
    // Tính toán phân trang
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.showOrderDetails = false;
    setTimeout(() => {
      this.selectedOrder = null;
    }, 300);
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.loading = true;
    this.http.put(`http://localhost:8080/orders/${orderId}/status?status=${newStatus}`, {}).subscribe({
      next: (response: any) => {
        // Cập nhật lại đối tượng đơn hàng trong danh sách
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index].status = newStatus;
        }
        
        // Nếu đang xem chi tiết đơn hàng này
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
          this.selectedOrder.status = newStatus;
        }
        
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
        this.error = 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?')) {
      this.loading = true;
      this.http.delete(`http://localhost:8080/orders/${orderId}`).subscribe({
        next: () => {
          // Xóa đơn hàng khỏi danh sách
          this.orders = this.orders.filter(order => order.id !== orderId);
          
          // Nếu đang xem chi tiết đơn hàng này
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.closeOrderDetails();
          }
          
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Lỗi khi xóa đơn hàng:', err);
          this.error = 'Không thể xóa đơn hàng. Vui lòng thử lại sau.';
          this.loading = false;
        }
      });
    }
  }

  // Phân trang
  get paginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginationRange(): number[] {
    const range = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  }

  // Định dạng
  getStatusText(status: string): string {
    switch (status) {
      case 'APPROVED': return 'Đã hoàn thành';
      case 'PENDING': return 'Đang xử lý';
      case 'REJECTED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'PENDING': return 'status-pending';
      case 'REJECTED': return 'status-rejected';
      default: return '';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  }
}