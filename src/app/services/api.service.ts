import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/config';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  GetAllRoles(): Observable<any>{
    return this.http.get("https://freeapi.miniprojectideas.com/api/ClientStrive/GetAllRoles")
  }

  GetAllBrands(): Observable<any>{
    return this.http.get(API_URL + "brands")
  }

}
