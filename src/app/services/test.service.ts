import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient, HttpParams } from '@angular/common/http';;
import { Observable } from 'rxjs';

interface CartResponse {
    id: string;
    name: string;
    avatar: string;
    price: number
}

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiURL = API_URL + 'api/laptops/items'

  constructor(private http: HttpClient) { }

// TestService
getPosts(): Observable<CartResponse[]> {
    return this.http.get<CartResponse[]>(this.apiURL, { withCredentials: true });
  }

  checkQuantity(productId: number, quantity: number): Observable<boolean> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());

    return this.http.get<boolean>(`${API_URL}products/check-quantity`, { params, responseType: 'json' as 'json' });
  }
}
