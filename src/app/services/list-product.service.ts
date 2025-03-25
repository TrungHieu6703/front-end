

import { ListProduct } from '../interface/list-product';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListProductService {

  private apiURL = API_URL + 'products'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<{ message: string; status: number; data: ListProduct[] }> {
    return this.http.get<{ message: string; status: number; data: ListProduct[] }>
    (this.apiURL);
  }
  
  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    console.log(`${this.apiURL}/${id}`)
    return this.http.delete<void>(url);
  }

}
