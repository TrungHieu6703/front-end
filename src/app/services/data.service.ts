import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Định nghĩa kiểu Category
export interface CategoryType {
  id: string;
  name: string;
}

// Định nghĩa kiểu Attribute (chưa có options)
export interface AttributeType {
  id: string;
  name: string;
  options?: AttributeValue[]; // sẽ được cập nhật sau khi gọi API giá trị
}

// Định nghĩa kiểu Attribute Value (option)
export interface AttributeValue {
  id: string;
  value: string;
}

// Định nghĩa kiểu Product Attribute Value để lưu thông tin nhập
export interface ProductAttributeValue {
  attributeId: string;
  value: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // API lấy danh sách category
  getCategories(): Observable<CategoryType[]> {
    return this.http.get<any>(`${this.baseUrl}/categories`)
      .pipe(map(res => res.data)); // trích xuất mảng category từ key "data"
  }

  // API lấy danh sách thuộc tính của category theo id
  getAttributes(categoryId: string): Observable<AttributeType[]> {
    return this.http.get<AttributeType[]>(`${this.baseUrl}/api/categories/${categoryId}/attribute`);
  }

  // API lấy giá trị (options) của một thuộc tính theo attributeId
  getAttributeValues(attributeId: string): Observable<AttributeValue[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/attrbutes/${attributeId}/value`)
      .pipe(
        map(res => res.map(item => ({ id: item.id, value: item.value })))
      );
  }
}
