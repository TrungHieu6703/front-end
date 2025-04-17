// product-line.component.ts
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

@Component({
  selector: 'app-product-line',
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
  templateUrl: './product-line.component.html',
  styleUrl: './product-line.component.css'
})
export class ProductLineComponent implements OnInit {
  productLineId: string = '';
  // ID của danh mục Laptop - cố định vì product line thường là Laptop
  laptopCategoryId: string = '1e4de469-0280-11f0-8579-0242ac110002'; // ID thực tế của danh mục laptop
  products: any[] = [];
  isVisibleCompare = false;
  isVisibleCompareLess = true;

  constructor(
    private wishlistService: WishlistService, 
    private sharedService: SharedService, 
    private filterService: FilterService,
    private route: ActivatedRoute
  ) {
    this.sharedService.CompareState$.subscribe((state) => (this.isVisibleCompare = state));
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompareLess = state));
  }

  ngOnInit() {
    // Lấy productLineId từ route parameter
    this.route.paramMap.subscribe(params => {
      this.productLineId = params.get('id') || '';
      
      // Lắng nghe query params để áp dụng filter
      this.route.queryParams.subscribe(queryParams => {
        // Bỏ tham số product_line từ queryParams nếu có
        const { product_line, ...restFilters } = queryParams;
        this.loadProductsByProductLine(this.productLineId, restFilters);
      });
    });
  }

  loadProductsByProductLine(productLineId: string, filters = {}) {
    if (!productLineId) return;
    
    // KHÔNG thêm product_line vào filters nữa vì đã có trong URL path
    this.filterService.getProductLines(productLineId, filters).subscribe({
      next: (response) => {
        // Kiểm tra trường hợp response là mảng trực tiếp
        if (Array.isArray(response)) {
          this.products = response;
        } 
        // Kiểm tra trường hợp response là đối tượng có data là mảng
        else if (response && response.data && Array.isArray(response.data)) {
          this.products = response.data;
        } 
        else {
          console.error('API trả về không đúng định dạng:', response);
          this.products = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu sản phẩm:', err),
    });
  }

  listCompare: ({id: string, image: string; name: string } | null)[] = [null, null, null, null];

  addToListCompare(product: { id: string, image: string; name: string }): void {
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