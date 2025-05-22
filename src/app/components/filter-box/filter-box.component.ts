// filter-box.component.ts
import { Component, OnInit, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { API_URL } from '../../config/config';
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
  message: string;
  status: number;
  data: Filter[];
}

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
  selector: 'app-filter-box',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './filter-box.component.html',
  styleUrl: './filter-box.component.css'
})
export class FilterBoxComponent implements OnInit, OnChanges {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  // Inputs
  @Input() categoryId!: string;
  @Input() mode: 'category' | 'brand' | 'product_line' = 'category';
  
  // Các thuộc tính component
  filters: Filter[] = [];
  selectedFilters: { [key: string]: string[] } = {};
  isOpen: { [key: string]: boolean } = {};
  loading = false;
  error = false;
  
  // Dành cho chế độ brand: danh sách các danh mục
  categories: Category[] = [];
  selectedCategoryId: string = '';
  loadingCategories = false;


  ngOnInit() {
    // Khởi tạo giá trị cho product_line nếu cần
    this.initializeComponent();
    
    // Đọc query params từ URL hiện tại
    this.route.queryParams.subscribe(params => {
      // Khởi tạo selectedFilters từ query params
      this.selectedFilters = {};
      
      Object.keys(params).forEach(key => {
        // Tìm các query param có dạng attr_{id}
        if (key.startsWith('attr_')) {
          const filterId = key.substring(5); // lấy phần sau attr_
          const values = Array.isArray(params[key]) ? params[key] : [params[key]];
          this.selectedFilters[filterId] = values;
        }
      });
      
      // Sau đó mới tải bộ lọc nếu đã có categoryId
      if (this.categoryId) {
        this.fetchFilters();
      }
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // Nếu categoryId thay đổi, cập nhật lại bộ lọc
    if (changes['categoryId'] && !changes['categoryId'].firstChange) {
      this.fetchFilters();
    }
    
    // Nếu mode thay đổi, khởi tạo lại component
    if (changes['mode'] && !changes['mode'].firstChange) {
      this.initializeComponent();
    }
  }
  
  private initializeComponent() {
    // Xử lý theo từng mode
    if (this.mode === 'product_line' && !this.categoryId) {
      // Mặc định cho product_line là danh mục laptop
      this.categoryId = '1e4de469-0280-11f0-8579-0242ac110002'; // ID thực tế của danh mục laptop
    } else if (this.mode === 'brand') {
      // Chế độ brand cần tải danh sách categories để người dùng chọn
      this.fetchCategories();
    }
  }
  
  private fetchCategories() {
    this.loadingCategories = true;
    
    this.http.get<CategoryResponse>(API_URL +`/categories`)
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
          
          // Nếu chưa có category được chọn, chọn cái đầu tiên
          if (this.categories.length > 0 && !this.selectedCategoryId) {
            this.selectedCategoryId = this.categories[0].id;
            this.categoryId = this.selectedCategoryId;
            this.fetchFilters();
          }
        } else {
          console.error('API categories trả về không đúng định dạng:', response);
          this.categories = [];
        }
      });
  }

  fetchFilters() {
    this.loading = true;
    this.error = false;
    
    if (!this.categoryId) {
      console.error('categoryId is required to fetch filters');
      this.error = true;
      this.loading = false;
      return;
    }
    
    this.http.get<any>(API_URL + `api/filters/category/${this.categoryId}`)
      .pipe(
        catchError(err => {
          console.error('Error fetching filters', err);
          this.error = true;
          return of({ filters: [] });
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(response => {
        // Kiểm tra cấu trúc dữ liệu trả về
        if (response && response.filters && Array.isArray(response.filters)) {
          // Trường hợp API trả về {filters: Array}
          this.filters = response.filters;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Trường hợp API trả về {data: Array}
          this.filters = response.data;
        } else if (Array.isArray(response)) {
          // Trường hợp API trả về Array trực tiếp
          this.filters = response;
        } else {
          console.error('API filters trả về không đúng định dạng:', response);
          this.filters = [];
          return;
        }
        
        // Khởi tạo trạng thái cho các bộ lọc
        this.filters.forEach(filter => {
          this.isOpen[filter.id] = true;
          if (!this.selectedFilters[filter.id]) {
            this.selectedFilters[filter.id] = [];
          }
        });
      });
  }
  
  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCategoryId = select.value;
    this.categoryId = this.selectedCategoryId;
    this.fetchFilters();
  }

  toggleFilter(filterId: string) {
    this.isOpen[filterId] = !this.isOpen[filterId];
  }

  toggleSelection(filterId: string, valueId: string) {
    if (!this.selectedFilters[filterId]) {
      this.selectedFilters[filterId] = [];
    }
    
    const index = this.selectedFilters[filterId].indexOf(valueId);
    if (index === -1) {
      this.selectedFilters[filterId].push(valueId);
    } else {
      this.selectedFilters[filterId].splice(index, 1);
    }
    
    this.applyFilters();
  }

  isSelected(filterId: string, valueId: string): boolean {
    return this.selectedFilters[filterId]?.includes(valueId) || false;
  }

  getSelectedCount(filterId: string): number {
    return this.selectedFilters[filterId]?.length || 0;
  }

  resetFilter(filterId: string) {
    // Xóa filter khỏi selectedFilters
    this.selectedFilters[filterId] = [];
    
    // Áp dụng bộ lọc và cập nhật URL
    this.applyFilters();
  }

  applyFilters() {
    console.log('Applied filters:', this.selectedFilters);
    
    // Chuyển đổi selectedFilters thành queryParams
    const queryParams: { [key: string]: string | string[] } = {};
    
    // Thêm các filter đã chọn vào queryParams
    Object.keys(this.selectedFilters).forEach(filterId => {
      const values = this.selectedFilters[filterId];
      if (values && values.length > 0) {
        // Sử dụng attr_ làm prefix cho filterId
        const paramKey = `attr_${filterId}`;
        queryParams[paramKey] = values.length === 1 ? values[0] : values;
      }
    });
    
    // Lấy tất cả query params hiện tại
    const currentParams = { ...this.route.snapshot.queryParams };
    
    // Xóa tất cả các query params bắt đầu bằng attr_
    Object.keys(currentParams).forEach(key => {
      if (key.startsWith('attr_')) {
        delete currentParams[key];
      }
    });
    
    // Kết hợp với query params mới
    const mergedParams = { ...currentParams, ...queryParams };
    
    // Cập nhật URL với query params mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: mergedParams,
      replaceUrl: true
    });
  }
  
  retryFetch() {
    this.fetchFilters();
  }
}