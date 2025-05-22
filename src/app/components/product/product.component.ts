import { CardModule } from 'primeng/card';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { EditorModule } from 'primeng/editor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { EditorComponent } from "../editor/editor.component";
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicProductComponent } from '../dynamic-product/dynamic-product.component';
import { API_URL } from '../../config/config';
interface Product {
  name: string;
  price: number;
  quantity: number;
  brand: string;
  category: string;
  coupon: string;
  description: string;
  attributes: { attributeValueId: string; value: string }[];
}
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CardModule, TableModule, ToggleButtonModule,DynamicProductComponent,
    FormsModule, EditorModule, ButtonModule,
    InputTextModule, EditorComponent, FileUploadModule,
    ToastModule, CommonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements AfterViewInit {
  @ViewChild(DynamicProductComponent) dynamicProductComponent!: DynamicProductComponent;

  data1?: string

  ngAfterViewInit(): void {
    console.log('child component', this.dynamicProductComponent)
  }

  product: Product = {
    name: 'Thinkpad Form Upload',
    price: 1,
    quantity: 1,
    brand: '664a7a9c-0283-11f0-8579-0242ac110002',
    category: '1e4de469-0280-11f0-8579-0242ac110002',
    coupon: '8261e4d5-f025-11ef-a4f3-0242ac110002',
    description: 'Spring-app',
    attributes: [
    ],
  };

  selectedFiles: File[] = [];
  data: string = `a`;
  image: any[] = [];
  imageSrcList: string[] = []; // Danh sách ảnh
  private http = inject(HttpClient);

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files); // Chuyển FileList thành mảng File[]
      console.log("Selected files:", this.selectedFiles);
    }
  }

  submitClicked() {
    this.product.attributes = JSON.parse(this.dynamicProductComponent.handleSubmit());
    console.log('data >>>>>>>', this.data)

    if (!this.product.name || !this.product.price || !this.product.quantity) {
      console.error("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", this.product.name);
    formData.append("price", this.product.price.toString());
    formData.append("quantity", this.product.quantity.toString());
    formData.append("brandId", this.product.brand);
    formData.append("categoryId", this.product.category);
    formData.append("couponId", this.product.coupon);

    
    const attributesBlob = new Blob([JSON.stringify(this.product.attributes)], { type: "application/json" });
    formData.append("attributes", attributesBlob);
  
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append("files", file, file.name);
      });
    }
    
  
    if (!this.data) {
      formData.append("description", "");
      this.createProduct(formData);
      return;
    }
  
    // Lấy danh sách ảnh trong mô tả
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.data, "text/html");
    const images = Array.from(doc.getElementsByTagName("img"));
    this.imageSrcList = images.map(img => img.src);
  
    console.log("Danh sách ảnh:", this.imageSrcList);
  
    if (this.imageSrcList.length === 0) {
      formData.append("description", this.data);
      this.createProduct(formData);
      return;
    }
  
    const formData1 = new FormData();
  
    // Tạo danh sách promises để fetch ảnh
    const imagePromises = this.imageSrcList.map((src, index) =>
      fetch(src)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `image${index}.jpg`, { type: "image/jpeg" });
          formData1.append("files1", file);
        })
        .catch(error => console.error("Lỗi khi tải ảnh:", error))
    );
  
    // Đợi tất cả ảnh fetch xong trước khi gửi request
    Promise.all(imagePromises).then(() => {
      if (formData1.has("files1")) {
        this.http.post<any[]>(API_URL + "products/upload-multiple", formData1)
          .subscribe({
            next: (data) => {
              this.image = data;
              console.log("Ảnh upload thành công:", data);
  
              for (let i = 0; i < this.image.length; i++) {
                if (this.image[i]) {
                  this.data = this.data.replace(this.imageSrcList[i], this.image[i]);
                }
              }
  
              console.log("Mô tả sau khi cập nhật ảnh:", this.data);
              formData.append("description", this.data);
              this.createProduct(formData);
            },
            error: (error) => console.error("Lỗi khi upload ảnh:", error),
          });
      } else {
        console.error("Không có file nào được thêm vào formData1!");
      }
    });
  }
  
  createProduct(formData: FormData) {
    this.http.post<any>( API_URL + "products/create", formData).subscribe(
      (response) => console.log("Thêm sản phẩm thành công!", response),
      (error) => console.error("Lỗi khi thêm sản phẩm:", error)
    );
  }
  

  onTextChange() {
    if (!this.data) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(this.data, "text/html");

    const images = Array.from(doc.getElementsByTagName("img"));
    this.imageSrcList = images.map((img) => img.src);
  }
}

