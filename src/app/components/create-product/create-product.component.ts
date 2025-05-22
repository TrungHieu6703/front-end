// create-product.component.ts
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductEditorService, Product } from '../../services/product-editor.service'
import { DynamicProductComponent } from '../dynamic-product/dynamic-product.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditorComponent } from "../editor/editor.component";
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService, Brand, CategoryType, ProductLine } from '../../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CardModule, TableModule, ToggleButtonModule, DynamicProductComponent,
    FormsModule, EditorModule, ButtonModule, TabViewModule,
    InputTextModule, EditorComponent, ToastModule,
    CommonModule, ReactiveFormsModule, InputTextareaModule,
    DropdownModule, InputNumberModule, CheckboxModule
  ],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  @ViewChild(DynamicProductComponent) dynamicProductComponent!: DynamicProductComponent;

  product: Product = {
    id: '',
    name: 'Thinkpad Form Upload',
    price: 1,
    quantity: 1,
    brand: '',
    category: '',
    productLine: '', // Đã đổi từ coupon sang productLine
    specs_summary: '',
    description: 'Spring-app',
    attributes: [],
    is_hot: false
  };

  brands: Brand[] = [];
  categories: CategoryType[] = [];
  allProductLines: ProductLine[] = [];
  productLines: ProductLine[] = [];

  selectedFiles: File[] = [];
  editorContent: string = '';
  isLoading = false;
  activeTabIndex: number = 0;

  constructor(
    private productEditorService: ProductEditorService,
    private dataService: DataService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Lấy danh sách brands
    this.dataService.getBrands().subscribe(data => {
      this.brands = data;
    });

    // Lấy danh sách categories
    this.dataService.getCategories().subscribe(data => {
      this.categories = data;
    });

    // Lấy tất cả product lines để lọc sau
    this.dataService.getProductLines().subscribe(data => {
      this.allProductLines = data;
    });
  }

  nextTab() {
    if (this.activeTabIndex < 3) {
      this.activeTabIndex++;
    }
  }

  prevTab() {
    if (this.activeTabIndex > 0) {
      this.activeTabIndex--;
    }
  }

  onBrandChange(event: any) {
    const selectedBrandId = event.value;

    // Lọc product lines theo brand đã chọn
    if (selectedBrandId) {
      this.productLines = this.allProductLines.filter(line => line.brandId === selectedBrandId);
    } else {
      this.productLines = [];
    }

    // Reset giá trị product line đã chọn
    this.product.productLine = '';
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  getSafeUrl(file: File) {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  removeFile(index: number) {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  submitClicked() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    // Lấy dữ liệu thuộc tính từ component động
    const attributesData = this.dynamicProductComponent.handleSubmit();

    // Tạo FormData
    const formData = this.productEditorService.createFormData(
      this.product,
      this.selectedFiles,
      attributesData
    );

    // Xử lý nội dung editor
    this.productEditorService.processEditorContent(this.editorContent, formData)
      .subscribe({
        next: (processedFormData) => {
          // Gửi dữ liệu đã xử lý lên server
          this.productEditorService.createProduct(processedFormData)
            .subscribe({
              next: (response) => {
                console.log("Thêm sản phẩm thành công!", response);
                this.isLoading = false;
                // this.router.navigate(['/products']);
              },
              error: (error) => {
                console.error("Lỗi khi thêm sản phẩm:", error);
                this.isLoading = false;
              }
            });
        },
        error: (error) => {
          console.error("Lỗi khi xử lý nội dung editor:", error);
          this.isLoading = false;
        }
      });
  }

  validateForm(): boolean {
    if (!this.product.name || !this.product.price || !this.product.quantity
      || !this.product.brand || !this.product.category || !this.product.productLine) {
      console.error("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return false;
    }
    return true;
  }

  goBackToAdmin() {
    this.router.navigate(['/admin/product']);
  }
}