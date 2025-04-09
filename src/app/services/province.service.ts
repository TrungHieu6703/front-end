import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private apiUrl = 'https://provinces.open-api.vn/api/p/';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
