// compare.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/config';

export interface ProductCompare {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  attributes: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class CompareService {
  private apiUrl = API_URL + 'api/laptops';

  constructor(private http: HttpClient) { }

  compareProducts(productIds: string[]): Observable<ProductCompare[]> {
    return this.http.get<ProductCompare[]>(`${this.apiUrl}/compare?ids=${productIds.join(',')}`);
  }

  detailProduct(productId: string): Observable<ProductCompare>{
    return this.http.get<ProductCompare>(`${this.apiUrl}/product/${productId}`)
  }
}