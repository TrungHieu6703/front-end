

import { AttributeValue } from '../interface/attribute-value';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttributeValueService {

  private apiURL = API_URL + 'attribute-values'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<{ message: string; status: number; data: AttributeValue[] }> {
    return this.http.get<{ message: string; status: number; data: AttributeValue[] }>
    (this.apiURL);
  }
  
  getPost(id: string): Observable<AttributeValue> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<AttributeValue>(url);
  }


  create(post: AttributeValue): Observable<string> {
    return this.http.post<string>(this.apiURL, post);
  }


  update(id: string, post: AttributeValue): Observable<string> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<string>(url, post);
  }


  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    console.log(`${this.apiURL}/${id}`)
    return this.http.delete<void>(url);
  }

}
