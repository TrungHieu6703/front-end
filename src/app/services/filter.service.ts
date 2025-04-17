

import { ListProduct } from '../interface/list-product';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private apiURL = API_URL + 'api/products/'

  constructor(private http: HttpClient) { }

  getPosts(categoryId: string, filters: { [key: string]: string } = {}): Observable<{ message: string; status: number; data: ListProduct[] }> {
    const url = `${this.apiURL}category/${categoryId}`;
    return this.http.get<{ message: string; status: number; data: ListProduct[] }>(url, { params: filters });
  }
  
  getBrands(brandId: string, filters: { [key: string]: string } = {}): Observable<{ message: string; status: number; data: ListProduct[] }> {
    const url = `${this.apiURL}brand/${brandId}`;
    return this.http.get<{ message: string; status: number; data: ListProduct[] }>(url, { params: filters });
  }
  
  getProductLines(product_lineId: string, filters: { [key: string]: string } = {}): Observable<{ message: string; status: number; data: ListProduct[] }> {
    const url = `${this.apiURL}productline/${product_lineId}`;
    return this.http.get<{ message: string; status: number; data: ListProduct[] }>(url, { params: filters });
  }

  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    return this.http.delete<void>(url);
  }

}
