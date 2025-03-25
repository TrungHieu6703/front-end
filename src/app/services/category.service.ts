

import { Category } from '../interface/category';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiURL = API_URL + 'categories'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<{ message: string; status: number; data: Category[] }> {
    return this.http.get<{ message: string; status: number; data: Category[] }>
    (this.apiURL);
  }
  
  getPost(id: string): Observable<Category> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Category>(url);
  }


  create(post: Category): Observable<string> {
    return this.http.post<string>(this.apiURL, post);
  }


  update(id: string, post: Category): Observable<string> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<string>(url, post);
  }


  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    console.log(`${this.apiURL}/${id}`)
    return this.http.delete<void>(url);
  }

}
