import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
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
    NgIf],
  providers: [],
  templateUrl: './laptop-item.component.html',
  styleUrl: './laptop-item.component.css'
})
export class LaptopItemComponent implements OnInit {
  isInWishlist: boolean = false;
  isInCart: boolean = false;
  constructor(private wishlistService: WishlistService,private cartService : CartService) {}

  @Input() product: any;
  @Input() isCompared: boolean = false;
  @Output() addToCompare = new EventEmitter<any>();

  ngOnInit() {
    // Kiểm tra xem sản phẩm đã có trong wishlist chưa
    this.isInWishlist = this.wishlistService.isInWishlist(this.product.name);
    this.isInCart = this.cartService.isInCart(this.product.name);
  }

  addToCart() {
    this.cartService.toggleCart(this.product);

    this.isInCart = !this.isInCart;
  }

  love() {
    // Gọi service để toggle wishlist
    this.wishlistService.toggleWishlist(this.product);
    // Cập nhật trạng thái wishlist local
    this.isInWishlist = !this.isInWishlist;
  }

  addToListCompare() {
    this.addToCompare.emit(this.product);
  }
}