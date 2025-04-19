import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  
  dashboardStats: any = {};
  timeRangeStats: any = {};
  topProducts: any[] = [];
  
  // Biểu đồ
  revenueChart: any;
  statusChart: any;
  
  // Khoảng thời gian
  startDate: string = '';
  endDate: string = '';
  
  loading: boolean = false;
  error: string = '';

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    // Khởi tạo khoảng thời gian mặc định (30 ngày gần nhất)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.startDate = this.formatDate(thirtyDaysAgo);
    this.endDate = this.formatDate(today);
    
    // Tải dữ liệu thống kê
    this.loadDashboardStats();
  }
  
  ngAfterViewInit(): void {
    // Tải dữ liệu cho biểu đồ sau khi view đã khởi tạo
    this.loadTimeRangeStats();
  }

  // Format ngày sang yyyy-MM-dd
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Tải thống kê tổng quan
  loadDashboardStats(): void {
    this.loading = true;
    this.statisticsService.getDashboardStatistics().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.topProducts = data.topProducts || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải thống kê tổng quan';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Tải thống kê theo khoảng thời gian
  loadTimeRangeStats(): void {
    this.loading = true;
    this.statisticsService.getTimeRangeStatistics(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.timeRangeStats = data;
        this.loading = false;
        
        // Đợi Angular render xong DOM và có dữ liệu trước khi khởi tạo biểu đồ
        setTimeout(() => {
          this.initCharts();
        }, 100);
      },
      error: (err) => {
        this.error = 'Không thể tải thống kê theo khoảng thời gian';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Khởi tạo cả hai biểu đồ
  initCharts(): void {
    this.createRevenueChart();
    this.createStatusChart();
  }

  // Áp dụng khoảng thời gian mới
  applyDateRange(): void {
    // Hủy biểu đồ cũ nếu có
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.statusChart) {
      this.statusChart.destroy();
    }
    
    this.loadTimeRangeStats();
  }

  // Tạo biểu đồ doanh thu theo ngày
  createRevenueChart(): void {
    if (!this.revenueChartRef || !this.revenueChartRef.nativeElement) {
      console.error('Canvas element for revenue chart not found');
      return;
    }
    
    const canvas = this.revenueChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context for revenue chart');
      return;
    }
    
    const revenueByDate = this.timeRangeStats?.revenueByDate || {};
    const dates = Object.keys(revenueByDate).sort();
    const revenues = dates.map(date => revenueByDate[date]);
    
    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Doanh thu',
          data: revenues,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Tạo biểu đồ theo trạng thái
  createStatusChart(): void {
    if (!this.statusChartRef || !this.statusChartRef.nativeElement) {
      console.error('Canvas element for status chart not found');
      return;
    }
    
    const canvas = this.statusChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context for status chart');
      return;
    }
    
    const revenueByStatus = this.timeRangeStats?.revenueByStatus || {};
    const statuses = Object.keys(revenueByStatus);
    const statusRevenues = statuses.map(status => revenueByStatus[status]);
    
    this.statusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: statuses.map(status => this.formatStatus(status)),
        datasets: [{
          data: statusRevenues,
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  // Format trạng thái đơn hàng
  formatStatus(status: string): string {
    switch (status) {
      case 'APPROVED': return 'Đã hoàn thành';
      case 'PENDING': return 'Đang xử lý';
      case 'REJECTED': return 'Đã hủy';
      default: return status;
    }
  }

  // Format số tiền
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
}