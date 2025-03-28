import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  GetAllRoles(): Observable<any>{
    return this.http.get("https://freeapi.miniprojectideas.com/api/ClientStrive/GetAllRoles")
  }

  GetAllBrands(): Observable<any>{
    return this.http.get("http://localhost:8080/brands")
  }

}
