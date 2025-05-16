import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  wishlistCount: number = 0;
  cartCount: number = 0;
  activeDropdown: string | null = null;
  
  // Thời gian trễ để tránh dropdown đóng ngay lập tức
  private dropdownTimeout: any;
  private dropdownHideDelay: number = 500; // Kéo dài thời gian trễ

  constructor(private wishlistService: WishlistService, private cartService: CartService) {}

  private http = inject(HttpClient);
  
  ngOnInit() {
    this.wishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistCount = wishlist.length; 
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.length; 
    });
  }

  showDropdown(menu: string) {
    // Xóa timeout nếu đang có
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    this.activeDropdown = menu;
  }

  keepDropdownOpen(menu: string) {
    // Xóa timeout khi di chuột vào dropdown
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    // Đảm bảo dropdown đang hiển thị
    this.activeDropdown = menu;
  }

  startHideDropdown() {
    // Tạo độ trễ khi rời khỏi menu để tạo trải nghiệm tốt hơn
    this.dropdownTimeout = setTimeout(() => {
      this.activeDropdown = null;
    }, this.dropdownHideDelay);
  }
}