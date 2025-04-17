// filter.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

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

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  filters: Filter[] = [];
  selectedFilters: { [key: string]: string[] } = {};
  isOpen: { [key: string]: boolean } = {};
  loading = false;
  error = false;
  
  // Category ID có thể được truyền vào qua @Input() nếu cần thiết
  categoryId = '1e4de469-0280-11f0-8579-0242ac110002';
  
  // API endpoint
  apiUrl = 'http://localhost:8080/api/filters/category';

  ngOnInit() {
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
      
      // Sau đó mới tải bộ lọc
      this.fetchFilters();
    });
  }

  fetchFilters() {
    this.loading = true;
    this.error = false;
    
    this.http.get<FilterResponse>(`${this.apiUrl}/${this.categoryId}`)
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
        this.filters = response.filters;
        
        // Khởi tạo trạng thái cho các bộ lọc
        this.filters.forEach(filter => {
          this.isOpen[filter.id] = true;
          if (!this.selectedFilters[filter.id]) {
            this.selectedFilters[filter.id] = [];
          }
        });
      });
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
    this.selectedFilters[filterId] = [];
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
    
    // Cập nhật URL với query params mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      // Giữ các query param khác không liên quan đến filter
      queryParamsHandling: 'merge'
    });
    
    // Tạo URL đầy đủ để log
    const baseUrl = `${window.location.origin}${this.router.url.split('?')[0]}`;
    const queryString = Object.keys(queryParams)
      .map(key => {
        if (Array.isArray(queryParams[key])) {
          return (queryParams[key] as string[])
            .map(value => `${key}=${value}`)
            .join('&');
        }
        return `${key}=${queryParams[key]}`;
      })
      .join('&');
    
    const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    window.location.href = fullUrl
  }
  
  retryFetch() {
    this.fetchFilters();
  }
}