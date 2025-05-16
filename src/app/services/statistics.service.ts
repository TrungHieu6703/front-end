// statistics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8080/api/statistics';

  constructor(private http: HttpClient) { }

  // Lấy thống kê tổng quan
  getDashboardStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // Lấy thống kê theo khoảng thời gian
  getTimeRangeStatistics(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/time-range?startDate=${startDate}&endDate=${endDate}`);
  }

  // Lấy sản phẩm bán chạy
  getTopProducts(limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-products?limit=${limit}`);
  }


  getPendingOrdersCount(): Observable<{ pendingOrders: number }> {
    return this.http.get<{ pendingOrders: number }>(`${this.apiUrl}/pending-orders-count`);
  }
}