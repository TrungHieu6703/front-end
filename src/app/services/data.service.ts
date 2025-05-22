import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../config/config';

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

export interface Brand {
  id: string;
  name: string;
}

export interface ProductLine {
  id: string;
  brandId: string;
  line_name: string;
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

  constructor(private http: HttpClient) { }

  // API lấy danh sách category
  getCategories(): Observable<CategoryType[]> {
    return this.http.get<any>(API_URL + `categories`)
      .pipe(map(res => res.data)); // trích xuất mảng category từ key "data"
  }

  // API lấy danh sách thuộc tính của category theo id
  getAttributes(categoryId: string): Observable<AttributeType[]> {
    return this.http.get<AttributeType[]>(API_URL + `api/categories/${categoryId}/attribute`);
  }

  // API lấy giá trị (options) của một thuộc tính theo attributeId
  getAttributeValues(attributeId: string): Observable<AttributeValue[]> {
    return this.http.get<any[]>(API_URL + `api/attrbutes/${attributeId}/value`)
      .pipe(
        map(res => res.map(item => ({ id: item.id, value: item.value })))
      );
  }

  getProductAttributeValues(productId: string) {
    return this.http.get<any[]>(API_URL + `product-attribute-values/${productId}/attributes`);
  }
  
  // Lấy thông tin category của sản phẩm  
  getProductCategory(productId: string) {
    return this.http.get<CategoryType>(API_URL + `product-attribute-values/${productId}/category`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<any>(API_URL + `brands`)
      .pipe(map(res => res.data));
  }

  // Thêm phương thức lấy product lines
  getProductLines(): Observable<ProductLine[]> {
    return this.http.get<any>(API_URL + `product-lines`)
      .pipe(map(res => res.data));
  }

  // Thêm phương thức lấy product lines theo brandId
  getProductLinesByBrand(brandId: string): Observable<ProductLine[]> {
    return this.http.get<any>(API_URL +   `product-lines`)
      .pipe(
        map(res => res.data.filter((line: ProductLine) => line.brandId === brandId))
      );
  }
}
