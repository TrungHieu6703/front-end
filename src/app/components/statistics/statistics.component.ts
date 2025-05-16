import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'; // Thêm OnDestroy
import { StatisticsService } from '../../services/statistics.service';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { Subscription, interval, switchMap } from 'rxjs'; // Thêm Subscription, interval, switchMap

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy { // Implement OnDestroy
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  dashboardStats: any = {};
  timeRangeStats: any = {};
  topProducts: any[] = [];

  revenueChart: any;
  statusChart: any;

  startDate: string = '';
  endDate: string = '';

  loading: boolean = false;
  error: string = '';

  private pollingInterval = 30000; // 30 giây
  private pendingOrdersSubscription!: Subscription;

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate = this.formatDate(thirtyDaysAgo);
    this.endDate = this.formatDate(today);

    this.loadDashboardStats(); // Tải lần đầu
    this.startPollingPendingOrders(); // Bắt đầu polling
  }

  ngAfterViewInit(): void {
    this.loadTimeRangeStats();
  }

  ngOnDestroy(): void { // Hủy subscription khi component bị destroy
    if (this.pendingOrdersSubscription) {
      this.pendingOrdersSubscription.unsubscribe();
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadDashboardStats(): void {
    this.loading = true; // Có thể bạn muốn có một loading indicator riêng cho phần này nếu nó không bị polling chồng chéo
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

  startPollingPendingOrders(): void {
    this.pendingOrdersSubscription = interval(this.pollingInterval)
      .pipe(
        switchMap(() => this.statisticsService.getPendingOrdersCount())
      )
      .subscribe({
        next: (data) => {
          // Chỉ cập nhật số lượng đơn chờ xử lý
          // Đảm bảo rằng dashboardStats đã được khởi tạo
          if (this.dashboardStats) {
            this.dashboardStats.pendingOrders = data.pendingOrders;
          } else {
            // Nếu dashboardStats chưa có, có thể khởi tạo nó ở đây
            // hoặc đợi loadDashboardStats hoàn thành
            this.dashboardStats = { pendingOrders: data.pendingOrders };
          }
          console.log('Cập nhật số đơn chờ xử lý:', data.pendingOrders);
        },
        error: (err) => {
          console.error('Lỗi khi polling đơn chờ xử lý:', err);
          // Có thể hiển thị một thông báo lỗi nhỏ, không ảnh hưởng đến toàn bộ trang
        }
      });
  }

  loadTimeRangeStats(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Vui lòng chọn ngày bắt đầu và ngày kết thúc.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.statisticsService.getTimeRangeStatistics(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.timeRangeStats = data;
        this.loading = false;
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

  initCharts(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.statusChart) {
      this.statusChart.destroy();
    }
    this.createRevenueChart();
    this.createStatusChart();
  }

  applyDateRange(): void {
    this.loadTimeRangeStats();
  }

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
            beginAtZero: true,
            ticks: {
              callback: (value) => this.formatCurrency(Number(value))
            }
          }
        }
      }
    });
  }

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
            'rgb(54, 162, 235)',  // APPROVED
            'rgb(255, 205, 86)',  // PENDING
            'rgb(255, 99, 132)'   // REJECTED
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += this.formatCurrency(context.parsed);
                }
                return label;
              }
            }
          }
        }
      }
    });
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'APPROVED': return 'Đã hoàn thành';
      case 'PENDING': return 'Đang xử lý';
      case 'REJECTED': return 'Đã hủy';
      default: return status;
    }
  }

  formatCurrency(value: number): string {
    if (isNaN(value) || value === null) return '0 VND';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  exportToExcel(): void {
    if (!this.timeRangeStats || Object.keys(this.timeRangeStats).length === 0) {
      alert('Không có dữ liệu thống kê theo thời gian để xuất.');
      return;
    }

    const fileName = `ThongKe_Tu_${this.startDate}_Den_${this.endDate}.xlsx`;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    const summaryData = [
      ["Mục", "Giá trị"],
      ["Tổng đơn hàng trong khoảng thời gian", this.timeRangeStats.totalOrders || 0],
      ["Tổng doanh thu trong khoảng thời gian", this.formatCurrency(this.timeRangeStats.totalRevenue || 0)]
    ];
    const wsSummary: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng Quan Theo Thời Gian');

    const revenueByDateData = [["Ngày", "Doanh thu"]];
    const revenueByDate = this.timeRangeStats.revenueByDate || {};
    Object.keys(revenueByDate).sort().forEach(date => {
      revenueByDateData.push([date, revenueByDate[date]]);
    });
    const wsRevenueByDate: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(revenueByDateData);
    const revenueColIndex = 1;
    for (let i = 1; i < revenueByDateData.length; i++) {
        const cellAddress = XLSX.utils.encode_cell({r: i, c: revenueColIndex});
        if (wsRevenueByDate[cellAddress]) {
            wsRevenueByDate[cellAddress].t = 'n';
            wsRevenueByDate[cellAddress].z = '#,##0 VND';
        }
    }
    XLSX.utils.book_append_sheet(wb, wsRevenueByDate, 'Doanh Thu Theo Ngày');

    const revenueByStatusData = [["Trạng Thái", "Doanh thu"]];
    const revenueByStatus = this.timeRangeStats.revenueByStatus || {};
    Object.keys(revenueByStatus).forEach(status => {
      revenueByStatusData.push([this.formatStatus(status), revenueByStatus[status]]);
    });
    const wsRevenueByStatus: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(revenueByStatusData);
    for (let i = 1; i < revenueByStatusData.length; i++) {
        const cellAddress = XLSX.utils.encode_cell({r: i, c: revenueColIndex});
        if (wsRevenueByStatus[cellAddress]) {
            wsRevenueByStatus[cellAddress].t = 'n';
             wsRevenueByStatus[cellAddress].z = '#,##0 VND';
        }
    }
    XLSX.utils.book_append_sheet(wb, wsRevenueByStatus, 'Doanh Thu Theo Trạng Thái');

    if (this.topProducts && this.topProducts.length > 0) {
      const topProductsData = [["STT", "Tên Sản Phẩm", "Số Lượng Đã Bán", "Doanh Thu"]];
      this.topProducts.forEach((product, index) => {
        topProductsData.push([
          index + 1,
          product.name,
          product.quantity,
          product.revenue
        ]);
      });
      const wsTopProducts: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(topProductsData);
      const revenueColIndexTopProduct = 3;
        for (let i = 1; i < topProductsData.length; i++) {
            const cellAddress = XLSX.utils.encode_cell({r: i, c: revenueColIndexTopProduct});
            if (wsTopProducts[cellAddress]) {
                wsTopProducts[cellAddress].t = 'n';
                wsTopProducts[cellAddress].z = '#,##0 VND';
            }
        }
      XLSX.utils.book_append_sheet(wb, wsTopProducts, 'Sản Phẩm Bán Chạy');
    }

    XLSX.writeFile(wb, fileName);
  }

  exportToCsv(): void {
    if (!this.timeRangeStats || Object.keys(this.timeRangeStats).length === 0) {
      alert('Không có dữ liệu thống kê theo thời gian để xuất.');
      return;
    }

    const fileName = `ThongKe_Tu_${this.startDate}_Den_${this.endDate}.csv`;
    let csvData = "";

    csvData += `Thống kê từ ngày ${this.startDate} đến ngày ${this.endDate}\n\n`;

    csvData += "Tổng Quan Theo Khoảng Thời Gian\n";
    csvData += "Mục,Giá trị\n";
    csvData += `Tổng đơn hàng trong khoảng thời gian,${this.timeRangeStats.totalOrders || 0}\n`;
    csvData += `Tổng doanh thu trong khoảng thời gian,"${this.formatCurrency(this.timeRangeStats.totalRevenue || 0)}"\n\n`;

    csvData += "Doanh Thu Theo Ngày\n";
    csvData += "Ngày,Doanh thu\n";
    const revenueByDate = this.timeRangeStats.revenueByDate || {};
    Object.keys(revenueByDate).sort().forEach(date => {
      csvData += `${date},${revenueByDate[date]}\n`;
    });
    csvData += "\n";

    csvData += "Doanh Thu Theo Trạng Thái Đơn Hàng\n";
    csvData += "Trạng Thái,Doanh thu\n";
    const revenueByStatus = this.timeRangeStats.revenueByStatus || {};
    Object.keys(revenueByStatus).forEach(status => {
      csvData += `"${this.formatStatus(status)}",${revenueByStatus[status]}\n`;
    });
    csvData += "\n";

    if (this.topProducts && this.topProducts.length > 0) {
      csvData += "Sản Phẩm Bán Chạy\n";
      csvData += "STT,Tên Sản Phẩm,Số Lượng Đã Bán,Doanh Thu\n";
      this.topProducts.forEach((product, index) => {
        csvData += `${index + 1},"${product.name}",${product.quantity},${product.revenue}\n`;
      });
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}