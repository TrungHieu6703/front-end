// product-editor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  category: string;
  productLine: string; // Thay đổi từ productline thành productLine
  specs_summary: string; // Thêm trường mới
  description: string;
  attributes: any[];
  is_hot: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ProductEditorService {
  constructor(private http: HttpClient) { }

  // Xử lý nội dung editor và upload ảnh từ editor
  processEditorContent(content: string, formData: FormData): Observable<FormData> {
    return new Observable(observer => {
      if (!content) {
        formData.append("description", "");
        observer.next(formData);
        observer.complete();
        return;
      }

      // Xử lý các ảnh trong editor
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const images = Array.from(doc.getElementsByTagName("img"));
      const imageSrcList = images.map(img => img.src);

      if (imageSrcList.length === 0) {
        formData.append("description", content);
        observer.next(formData);
        observer.complete();
        return;
      }

      // Upload các ảnh từ editor
      const formData1 = new FormData();

      const imagePromises = imageSrcList.map((src, index) =>
        fetch(src)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `image${index}.jpg`, { type: "image/jpeg" });
            formData1.append("files1", file);
          })
          .catch(error => console.error("Lỗi khi tải ảnh:", error))
      );

      Promise.all(imagePromises).then(() => {
        if (formData1.has("files1")) {
          this.http.post<any[]>("http://localhost:8080/products/upload-multiple", formData1)
            .subscribe({
              next: (data) => {
                let processedContent = content;

                for (let i = 0; i < data.length; i++) {
                  if (data[i]) {
                    processedContent = processedContent.replace(imageSrcList[i], data[i]);
                  }
                }

                formData.append("description", processedContent);
                observer.next(formData);
                observer.complete();
              },
              error: (error) => observer.error(error),
            });
        } else {
          formData.append("description", content);
          observer.next(formData);
          observer.complete();
        }
      });
    });
  }

  // Xử lý việc tạo FormData từ đối tượng product
  createFormData(product: Product, files: File[], attributesData: string): FormData {
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price.toString());
    formData.append("quantity", product.quantity.toString());
    formData.append("brandId", product.brand);
    formData.append("categoryId", product.category);
    formData.append("productLineId", product.productLine);
    formData.append("specs_summary", product.specs_summary);
    formData.append('is_hot', product.is_hot === true ? "true" : "false");
    // Xử lý attributes
    const attributes = JSON.parse(attributesData);
    const attributesBlob = new Blob([JSON.stringify(attributes)], { type: "application/json" });
    formData.append("attributes", attributesBlob);

    // Thêm files
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file, file.name);
      });
    }

    return formData;
  }

  // Thêm sản phẩm mới
  createProduct(formData: FormData): Observable<any> {
    return this.http.post<any>("http://localhost:8080/products/create", formData);
  }

  // Trong services/product-editor.service.ts, thêm phương thức updateProduct
  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/products/update/${productId}`, formData);
  }

  // Lấy thông tin sản phẩm 
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`http://localhost:8080/products/${id}`);
  }
}