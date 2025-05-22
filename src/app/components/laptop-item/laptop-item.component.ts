import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common'; // NgIf is already in CommonModule if you use Angular 14+
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton'; // Import SkeletonModule
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-laptop-item',
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
    NgIf, // NgIf can be removed if CommonModule is handling it (Angular 14+)
    SkeletonModule // Add SkeletonModule here
  ],
  providers: [],
  templateUrl: './laptop-item.component.html',
  styleUrls: ['./laptop-item.component.css'] // Corrected from styleUrl to styleUrls
})
export class LaptopItemComponent implements OnInit {
  isInWishlist: boolean = false;
  isInCart: boolean = false;
  
  constructor(private wishlistService: WishlistService, private cartService: CartService) {}

  @Input() product: any;
  @Input() isCompared: boolean = false;
  @Input() mode: 'default' | 'compare' | 'search' | 'wishlist'= 'default';
  @Input() loading: boolean = false; // New input for loading state

  @Output() addToCompare = new EventEmitter<any>();
  @Output() productSelectedForDetailCompare = new EventEmitter<any>();
  @Output() removeFromWishlist = new EventEmitter<any>(); // Thêm output event mới

  ngOnInit() {
    // Only try to access product.id if product is not null and loading is false
    if (this.product && !this.loading) {
      this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
      this.isInCart = this.cartService.isInCart(this.product.id);
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.toggleCart(this.product);
      this.isInCart = !this.isInCart;
    }
  }

  love() {
    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
      this.isInWishlist = !this.isInWishlist;
    }
  }

  addToListCompare() {
    if (this.product) {
      this.addToCompare.emit(this.product);
    }
  }

  addToListCompareDetail(): void {
    if (this.product) {
      console.log('Product ID from laptop-item for detail compare:', this.product.id);
      this.productSelectedForDetailCompare.emit(this.product);
    }
  }

  // Thêm method để xử lý xóa khỏi wishlist
  removeItem() {
    if (this.product) {
      this.wishlistService.removeFromWishlistById(this.product.id);
      this.removeFromWishlist.emit(this.product); // Emit event để parent component có thể cập nhật
    }
  }
}