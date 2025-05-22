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
import { WishlistService } from '../../services/wishlist.service';
import { LaptopItemComponent } from '../laptop-item/laptop-item.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    RouterModule,
    TableModule,
    CardModule,
    DataViewModule,
    TagModule,
    RatingModule,
    ButtonModule,
    LaptopItemComponent,
    HeaderComponent
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistProducts: any[] = [];

  constructor(
    private wishlistService: WishlistService,
  ) { }

  ngOnInit() {
    this.loadWishlist();
    
    // Subscribe to wishlist changes để tự động cập nhật khi có thay đổi
    this.wishlistService.wishlist$.subscribe(products => {
      this.wishlistProducts = products;
    });
  }

  loadWishlist() {
    this.wishlistProducts = this.wishlistService.getWishlist();
  }

  // Handle khi một item được xóa khỏi wishlist
  onRemoveFromWishlist(product: any) {
    // Không cần làm gì thêm vì wishlist service đã tự động cập nhật
    // và component đã subscribe để nhận thông báo thay đổi
    console.log('Đã xóa sản phẩm khỏi wishlist:', product.name);
  }
}