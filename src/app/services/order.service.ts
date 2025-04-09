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
  id: string;
  userId: string;
  status: string;
  total: number;
  orderDetails: OrderDetailRes[];
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

  constructor(private http: HttpClient) {}

  createOrder(orderData: OrderDTO): Observable<OrderRes> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<OrderRes>(this.apiUrl, orderData, { headers });
  }

  getOrderById(orderId: string): Observable<OrderRes> {
    return this.http.get<OrderRes>(`${this.apiUrl}/${orderId}`);
  }

  getUserOrders(userId: string): Observable<OrderRes[]> {
    return this.http.get<OrderRes[]>(`${this.apiUrl}/user/${userId}`);
  }
}