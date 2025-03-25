

import { Brand } from '../interface/brand';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiURL = API_URL + 'brands'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<{ message: string; status: number; data: Brand[] }> {
    return this.http.get<{ message: string; status: number; data: Brand[] }>
    (this.apiURL);
  }
  
  getPost(id: string): Observable<Brand> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Brand>(url);
  }


  create(post: Brand): Observable<string> {
    return this.http.post<string>(this.apiURL, post);
  }


  update(id: string, post: Brand): Observable<string> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<string>(url, post);
  }


  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    console.log(`${this.apiURL}/${id}`)
    return this.http.delete<void>(url);
  }

}
