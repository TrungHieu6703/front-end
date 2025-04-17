// brand-page.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CompareComponent } from '../compare/compare.component';
import { HeaderComponent } from '../header/header.component';
import { LaptopItemComponent } from '../laptop-item/laptop-item.component';
import { WishlistService } from '../../services/wishlist.service';
import { CompareButtonComponent } from '../compare-button/compare-button.component';
import { SharedService } from '../../services/shared.service';
import { FilterService } from '../../services/filter.service';
import { FilterBoxComponent } from "../filter-box/filter-box.component";
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Category {
  id: string;
  name: string;
}

interface CategoryResponse {
  message: string;
  status: number;
  data: Category[];
}

@Component({
  selector: 'app-brand-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    TableModule,
    CardModule,
    DataViewModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CompareComponent,
    HeaderComponent,
    LaptopItemComponent,
    CompareButtonComponent,
    FilterBoxComponent
  ],
  providers: [WishlistService],
  templateUrl: './brand-page.component.html',
  styleUrl: './brand-page.component.css'
})
export class BrandPageComponent implements OnInit {
  brandId: string = '';
  selectedCategoryId: string = '';
  products: any[] = [];
  isVisibleCompare = false;
  isVisibleCompareLess = true;
  categories: Category[] = [];
  loadingCategories = false;

  constructor(
    private wishlistService: WishlistService, 
    private sharedService: SharedService, 
    private filterService: FilterService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.sharedService.CompareState$.subscribe((state) => (this.isVisibleCompare = state));
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompareLess = state));
  }

  ngOnInit() {
    // Lấy brandId từ route parameter
    this.route.paramMap.subscribe(params => {
      this.brandId = params.get('id') || '';
      
      // Tải danh sách danh mục
      this.fetchCategories();
    });
  }

  fetchCategories() {
    this.loadingCategories = true;
    
    this.http.get<CategoryResponse>(`http://localhost:8080/categories`)
      .pipe(
        catchError(err => {
          console.error('Error fetching categories', err);
          return of({ message: 'Error', status: 500, data: [] });
        }),
        finalize(() => {
          this.loadingCategories = false;
        })
      )
      .subscribe(response => {
        // Kiểm tra nếu response và response.data tồn tại và là mảng
        if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data;
          
          // Nếu có danh mục, chọn danh mục đầu tiên và tải sản phẩm
          if (this.categories.length > 0) {
            this.selectedCategoryId = this.categories[0].id;
            
            // Lắng nghe query params để áp dụng filter
            this.route.queryParams.subscribe(queryParams => {
              this.loadProductsByBrandAndCategory(this.brandId, this.selectedCategoryId, queryParams);
            });
          }
        } else {
          console.error('API categories trả về không đúng định dạng:', response);
          this.categories = [];
        }
      }); 
  }

  loadProductsByBrandAndCategory(brandId: string, categoryId: string, filters = {}) {
    if (!brandId || !categoryId) return;
    
    // Sử dụng phương thức getBrands thay vì getPosts
    this.filterService.getBrands(brandId, { ...filters, category: categoryId }).subscribe({
      next: (response) => {
        // Xử lý response theo cấu trúc thực tế
        if (response && response.data && Array.isArray(response.data)) {
          this.products = response.data;
        } else if (Array.isArray(response)) {
          this.products = response;
        } else {
          console.error('API brand products trả về không đúng định dạng:', response);
          this.products = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu sản phẩm:', err),
    });
  }

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCategoryId = select.value;
    
    // Tải lại sản phẩm với danh mục mới
    this.route.queryParams.subscribe(queryParams => {
      this.loadProductsByBrandAndCategory(this.brandId, this.selectedCategoryId, queryParams);
    });
  }

  listCompare: ({id: string, image: string; name: string } | null)[] = [null, null, null, null];

  addToListCompare(product: {id: string, image: string; name: string }): void {
    if (this.isCompared(product)) {
      console.log("Sản phẩm đã được thêm vào so sánh");
      return;
    }

    const emptyIndex = this.listCompare.findIndex(item => item === null);
    
    if (emptyIndex !== -1) {
      // Thêm id vào đối tượng sản phẩm khi thêm vào danh sách so sánh
      this.listCompare[emptyIndex] = { 
        id: product.id,
        image: product.image, 
        name: product.name 
      };
    } else {
      console.log("So sánh tối đa 4 sản phẩm");
    }
  }

  isCompared(product: { name: string }): boolean {
    return this.listCompare.some(item => item !== null && item.name === product.name);
  }
}