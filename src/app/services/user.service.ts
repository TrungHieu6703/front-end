
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

export interface User {
    id?: string,
    name?: string,
    email?: string,
    phone?: string,
    
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = API_URL + 'users'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<{ message: string; status: number; data: User[] }> {
    return this.http.get<{ message: string; status: number; data: User[] }>
    (this.apiURL);
  }
  
  getPost(id: string): Observable<User> {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<User>(url);
  }


  create(post: User): Observable<string> {
    return this.http.post<string>(this.apiURL, post);
  }


  update(id: string, post: User): Observable<string> {
    const url = `${this.apiURL}/${id}`;
    return this.http.put<string>(url, post);
  }


  deletePost(id: string): Observable<void> {
    const url = `${this.apiURL}/${id}`;
    console.log(`${this.apiURL}/${id}`)
    return this.http.delete<void>(url);
  }

}
