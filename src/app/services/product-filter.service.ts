// product-filter.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/config';

interface FilterValue {
  id: string;
  value: string;
}

interface Filter {
  id: string;
  name: string;
  values: FilterValue[];
}

interface FilterResponse {
  filters: Filter[];
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {
  private http = inject(HttpClient);
  private apiBaseUrl = API_URL + 'api';

  getFilters(categoryId: string): Observable<FilterResponse> {
    return this.http.get<FilterResponse>(`${this.apiBaseUrl}/filters/category/${categoryId}`);
  }
  
  getFilteredProducts(
    categoryId: string, 
    filters: { [key: string]: string[] },
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'latest'
  ): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy);
    
    // Thêm các filter vào params
    Object.keys(filters).forEach(filterId => {
      if (filters[filterId] && filters[filterId].length > 0) {
        filters[filterId].forEach(valueId => {
          params = params.append(`filter[${filterId}]`, valueId);
        });
      }
    });
    
    return this.http.get<ProductsResponse>(
      `${this.apiBaseUrl}/products/category/${categoryId}`, 
      { params }
    );
  }
}