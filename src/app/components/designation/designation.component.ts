import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { ListProductService } from '../../services/list-product.service';
import { BrandComponent } from '../brand/brand.component';
import { LaptopComponent } from '../laptop/laptop.component';
import { BannerComponent } from '../banner/banner.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-designation',
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
    BannerComponent,
    BrandComponent,
    LaptopComponent,
    FooterComponent
  ],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent implements OnInit {
  products: any[] = [];

  isVisibleCompare = false;
  isVisibleCompareLess = true;

  constructor(private wishlistService: WishlistService, private sharedService: SharedService, private listProductService: ListProductService) {
    this.sharedService.CompareState$.subscribe((state) => (this.isVisibleCompare = state));
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompareLess = state));
  }

  ngOnInit() {
    this.loadListProducts();
  }

  loadListProducts() {
    this.listProductService.getPostsHot().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.products = response;
          console.log(response);
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.products = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }

  isCompareVisible = false;
  layout: 'list' | 'grid' = 'grid';

  // Cập nhật kiểu dữ liệu để bao gồm id
  listCompare: ({ id: string; image: string; name: string } | null)[] = [null, null, null, null];

  toggleCompare() {
    this.isCompareVisible = !this.isCompareVisible;
  }

  addToListCompare(product: { id: string; avatar: string; name: string }): void {
    if (this.isCompared(product)) {
      console.log("Sản phẩm đã được thêm vào so sánh");
      return;
    }

    const emptyIndex = this.listCompare.findIndex(item => item === null);
    
    if (emptyIndex !== -1) {
      // Thêm id vào đối tượng sản phẩm khi thêm vào danh sách so sánh
      this.listCompare[emptyIndex] = { 
        id: product.id,
        image: product.avatar, 
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