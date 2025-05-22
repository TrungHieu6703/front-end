// order-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService, ConfirmationService } from 'primeng/api';
import { API_URL } from '../../config/config';
interface StatusOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TagModule,
    TooltipModule,
    PaginatorModule
  ],
  providers: [MessageService, ConfirmationService],
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
  statusOptions: StatusOption[] = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'Đang xử lý', value: 'PENDING' },
    { label: 'Đã hoàn thành', value: 'APPROVED' },
    { label: 'Đã hủy', value: 'REJECTED' }
  ];
  
  // Phân trang
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get(API_URL + 'orders').subscribe({
      next: (response: any) => {
        this.orders = response.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách đơn hàng:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.'
        });
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
    
    // Tìm kiếm theo ID hoặc người dùng
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
  }

  confirmUpdateStatus(orderId: string, newStatus: string): void {
    const statusText = newStatus === 'APPROVED' ? 'duyệt' : 'hủy';
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn ${statusText} đơn hàng này?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateOrderStatus(orderId, newStatus);
      }
    });
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.loading = true;
    this.http.put(API_URL + `orders/${orderId}/status?status=${newStatus}`, {}).subscribe({
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
        
        const statusText = newStatus === 'APPROVED' ? 'duyệt' : 'hủy';
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Đơn hàng đã được ${statusText} thành công.`
        });
        
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.'
        });
        this.loading = false;
      }
    });
  }

  confirmDelete(orderId: string): void {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa đơn hàng này không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteOrder(orderId);
      }
    });
  }

  deleteOrder(orderId: string): void {
    this.loading = true;
    this.http.delete(API_URL + `orders/${orderId}`).subscribe({
      next: () => {
        // Xóa đơn hàng khỏi danh sách
        this.orders = this.orders.filter(order => order.id !== orderId);
        
        // Nếu đang xem chi tiết đơn hàng này
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
          this.closeOrderDetails();
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đơn hàng đã được xóa thành công.'
        });
        
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi xóa đơn hàng:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa đơn hàng. Vui lòng thử lại sau.'
        });
        this.loading = false;
      }
    });
  }

  // Phân trang với PrimeNG
  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
  }

  // Lấy đơn hàng theo trang hiện tại
  get paginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
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

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'APPROVED': return 'Đã hoàn thành';
      case 'PENDING': return 'Đang xử lý';
      case 'REJECTED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
  switch (status) {
    case 'APPROVED': return '#28a745';
    case 'PENDING': return '#ffc107';
    case 'REJECTED': return '#dc3545';
    default: return '#17a2b8';
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