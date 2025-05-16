import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CardModule, TableModule, ToggleButtonModule, DynamicProductComponent,
    FormsModule, EditorModule, ButtonModule, TabViewModule,
    InputTextModule, EditorComponent, ToastModule,
    CommonModule, ReactiveFormsModule, InputTextareaModule,
    DropdownModule, InputNumberModule, CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  @ViewChild(DynamicProductComponent) dynamicProductComponent!: DynamicProductComponent;

  product: Product = {
    id: '',
    name: '',
    price: 0,
    quantity: 0,
    brand: '',
    category: '',
    productLine: '',
    specs_summary: '',
    description: '',
    attributes: [],
    is_hot: false
  };

  brands: Brand[] = [];
  categories: CategoryType[] = [];
  allProductLines: ProductLine[] = [];
  productLines: ProductLine[] = [];

  selectedFiles: File[] = [];
  existingImages: string[] = [];
  editorContent: string = '';
  isLoading = false;
  activeTabIndex: number = 0;
  productId: string = '';

  constructor(
    private productEditorService: ProductEditorService,
    private dataService: DataService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private http: HttpClient
  ) { }

    ngOnInit() {
    this.isLoading = true;

    // Lấy ID sản phẩm từ URL
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });

    // Lấy dữ liệu backend theo thứ tự hợp lý để tránh vấn đề phụ thuộc dữ liệu
    
    // Lấy danh sách brands
    this.dataService.getBrands().subscribe(data => {
      this.brands = data;
    });

    // Lấy danh sách categories
    this.dataService.getCategories().subscribe(data => {
      this.categories = data;
    });

    // Lấy tất cả product lines trước
    this.dataService.getProductLines().subscribe(data => {
      this.allProductLines = data;
      console.log("Đã tải xong danh sách dòng sản phẩm:", this.allProductLines.length);
      
      // Sau khi tải xong product lines, mới tải dữ liệu sản phẩm
      this.loadProductData();
    });
  }

  productLoaded: boolean = false;

   loadProductData() {
    this.http.get<any>(`http://localhost:8080/products/${this.productId}`).subscribe({
      next: (response) => {
        if (response.status === 200 && response.data) {
          const productData = response.data;

          // Lấy dữ liệu từ server
          const brandId = productData.brand_id;
          const productLineId = productData.product_line_id;
          
          console.log(`Sản phẩm có brandId: ${brandId}, productLineId: ${productLineId}`);
          
          // Cập nhật danh sách dòng sản phẩm dựa trên brand
          if (brandId && this.allProductLines.length > 0) {
            // Lọc productLines theo brand
            this.productLines = this.allProductLines.filter(line => line.brandId === brandId);
            console.log(`Lọc được ${this.productLines.length} dòng sản phẩm cho brand ${brandId}`);
            
            // Kiểm tra và log thông tin của productLine hiện tại
            if (productLineId) {
              const foundProductLine = this.productLines.find(pl => pl.id === productLineId);
              console.log(foundProductLine ? 
                `Tìm thấy dòng sản phẩm: ${foundProductLine.line_name}` : 
                `Không tìm thấy dòng sản phẩm với id ${productLineId}`);
            }
          }

          // Cập nhật dữ liệu sản phẩm
          this.product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            quantity: productData.quantity,
            brand: brandId,
            category: productData.category_id,
            productLine: productLineId,
            specs_summary: productData.specs_summary || '',
            description: productData.description || '',
            attributes: [],
            is_hot: productData.is_hot || false,
          };

          // Cập nhật nội dung editor
          this.editorContent = productData.description || '';

          // Lưu các hình ảnh hiện có
          this.existingImages = productData.image || [];

          this.isLoading = false;
          // Đánh dấu đã tải xong dữ liệu sản phẩm
          this.productLoaded = true;

          console.log("Đã tải xong sản phẩm:", this.product);
        }
      },
      error: (error) => {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.'
        });
        this.isLoading = false;
      }
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
    console.log(`Brand đã thay đổi thành: ${selectedBrandId}`);
    
    // Lọc product lines theo brand đã chọn
    if (selectedBrandId && this.allProductLines.length > 0) {
      this.productLines = this.allProductLines.filter(line => line.brandId === selectedBrandId);
      console.log(`Đã tìm thấy ${this.productLines.length} dòng sản phẩm cho brand ${selectedBrandId}`);
      
      // Nếu productLine hiện tại không thuộc brand mới, reset giá trị
      if (this.product.productLine && 
          !this.productLines.some(line => line.id === this.product.productLine)) {
        console.log(`ProductLine ${this.product.productLine} không thuộc brand mới, đặt lại giá trị`);
        this.product.productLine = '';
      }
    } else {
      this.productLines = [];
      this.product.productLine = '';
    }
  }

  updateProductLinesByBrand(brandId: string) {
    // Lọc product lines theo brand đã chọn
    if (brandId) {
      this.productLines = this.allProductLines.filter(line => line.brandId === brandId);
    } else {
      this.productLines = [];
    }

    // Nếu productLine không thuộc brand mới, reset giá trị
    if (this.productLines.length > 0 && !this.productLines.some(line => line.id === this.product.productLine)) {
      this.product.productLine = '';
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  getSafeUrl(file: File): SafeUrl {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  removeFile(index: number) {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  removeExistingImage(index: number) {
    this.existingImages = this.existingImages.filter((_, i) => i !== index);
  }

  // Cập nhật phương thức submitClicked trong update-product.component.ts
  submitClicked() {
    if (!this.validateForm()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ thông tin sản phẩm!'
      });
      return;
    }

    this.isLoading = true;

    // Lấy dữ liệu thuộc tính từ component động
    const attributesData = this.dynamicProductComponent.handleSubmit();

    // Tạo FormData
    const formData = new FormData();

    // Thêm thông tin cơ bản
    formData.append('id', this.product.id);
    formData.append('name', this.product.name);
    formData.append('categoryId', this.product.category);
    formData.append('brandId', this.product.brand);
    formData.append('productLineId', this.product.productLine);
    formData.append('price', this.product.price.toString());
    formData.append('quantity', this.product.quantity.toString());
    formData.append('specs_summary', this.product.specs_summary || '');
    formData.append('is_hot', this.product.is_hot === true ? "true" : "false");
    // Thêm files mới
    if (this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }
    }

    // Thêm thông tin các hình ảnh hiện có cần giữ lại
    formData.append('existingImages', JSON.stringify(this.existingImages));

    // Thêm thông tin thuộc tính - FIX PHẦN NÀY
    // Đảm bảo attributesData là một mảng và chuyển đổi thành JSON string hợp lệ
    const attributes = JSON.parse(attributesData);
    const attributesBlob = new Blob([JSON.stringify(attributes)], { type: "application/json" });
    formData.append("attributes", attributesBlob);


    // Xử lý nội dung editor
    formData.append('description', this.editorContent || ''); // Thêm description trực tiếp

    this.productEditorService.updateProduct(this.productId, formData)
      .subscribe({
        next: (response) => {
          console.log("Cập nhật sản phẩm thành công!", response);
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật sản phẩm thành công!'
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Lỗi khi cập nhật sản phẩm:", error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật sản phẩm. Vui lòng thử lại sau.'
          });
          this.isLoading = false;
        }
      });
  }

  validateForm(): boolean {
    if (!this.product.name || !this.product.price || !this.product.quantity
      || !this.product.brand || !this.product.category || !this.product.productLine) {
      return false;
    }
    return true;
  }
}