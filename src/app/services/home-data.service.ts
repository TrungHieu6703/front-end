

import { HomeData } from '../interface/home-data';
import { Injectable } from '@angular/core';
import { API_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeDataService {

  private apiURL = API_URL + 'api/home'

  constructor(private http: HttpClient) { }

  getPosts(): Observable<HomeData> {
    return this.http.get<HomeData>
    (this.apiURL);
  }
}
