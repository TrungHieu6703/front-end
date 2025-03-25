

import { Attribute } from '../interface/attribute';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  private apiURL = API_URL + 'attributes'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<{ message: string; status: number; data: Attribute[] }> {
    return this.http.get<{ message: string; status: number; data: Attribute[] }>
    (this.apiURL);
  }
  
  getPost(id: string): Observable<Attribute> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Attribute>(url);
  }


  create(post: Attribute): Observable<string> {
    return this.http.post<string>(this.apiURL, post);
  }


  update(id: string, post: Attribute): Observable<string> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<string>(url, post);
  }


  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    console.log(`${this.apiURL}/${id}`)
    return this.http.delete<void>(url);
  }

}
