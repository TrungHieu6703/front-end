import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

interface ProductLine {
    id?: string,
    line_name?: string,
    brandId?: string
}

@Injectable({
  providedIn: 'root'
})
export class ProductLineService {

  private apiURL = API_URL + 'product-lines'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<{ message: string; status: number; data: ProductLine[] }> {
    return this.http.get<{ message: string; status: number; data: ProductLine[] }>
    (this.apiURL);
  }
  
  getPost(id: string): Observable<ProductLine> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<ProductLine>(url);
  }


  create(post: ProductLine): Observable<string> {
    return this.http.post<string>(this.apiURL, post);
  }


  update(id: string, post: ProductLine): Observable<string> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<string>(url, post);
  }


  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    console.log(`${this.apiURL}/${id}`)
    return this.http.delete<void>(url);
  }

}
