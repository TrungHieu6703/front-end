import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  wishlistCount: number = 0;
  cartCount : number = 0;

  constructor(private wishlistService : WishlistService, private cartService : CartService) {}

  private http = inject(HttpClient);
  brands: any[] = [];
  activeDropdown: string | null = null;
  ngOnInit() {
    // this.fetchBrands();
    this.wishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistCount = wishlist.length; 
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.length; 
    });
  }

  // fetchBrands() {
  //   this.http.get<any[]>('http://localhost:8080/brands/getAllBrandsWithProductLines')
  //     .subscribe({
  //       next: (data) => {
  //         this.brands = data;
  //         console.log('Fetched brands:', data);
  //       },
  //       error: (error) => console.error('Error fetching brands:', error)
  //     });
  // }

  showDropdown(menu: string) {
    this.activeDropdown = menu;
  }

  hideDropdown() {
    this.activeDropdown = null;
  }
}
