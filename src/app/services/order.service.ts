import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/config';

interface OrderDTO {
  user_id: string;
  status: string;
  total: number;
  shippingInfo: string;
  items: OrderItemDTO[];
}

interface OrderItemDTO {
  productId: string;
  quantity: number;
  price: number;
}

interface OrderRes {
  message: string;
  status: number;
  data: {
    id: string;
    userId: string;
    status: string;
    total: number;
    orderDetails: any[];
  };
}

interface OrderDetailRes {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = API_URL + 'orders';
  private vnpayApiUrl = API_URL + 'api/v1/pay';
  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderDTO): Observable<OrderRes> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<OrderRes>(this.apiUrl, orderData, { headers });
  }

  // getOrderById(orderId: string): Observable<OrderRes> {
  //   return this.http.get<OrderRes>(`${this.apiUrl}/${orderId}`);
  // }

  // getUserOrders(userId: string): Observable<OrderRes[]> {
  //   return this.http.get<OrderRes[]>(`${this.apiUrl}/user/${userId}`);
  // }

  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  // Lấy chi tiết đơn hàng
  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }

  // Hủy đơn hàng (cập nhật trạng thái)
  cancelOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status?status=REJECTED`, {});
  }

    // Lấy URL thanh toán VNPay
  getVnPayUrl(price: number, orderId: string): Observable<string> {
    return this.http.get(`${this.vnpayApiUrl}?price=${price}&orderId=${orderId}`, { responseType: 'text' });
  }
}