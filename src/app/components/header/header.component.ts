import { Component, inject, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { LaptopItemComponent } from '../laptop-item/laptop-item.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterModule, LaptopItemComponent, FormsModule, ToastModule, RouterLink],
  templateUrl: './header.component.html',
  providers:[MessageService],
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  wishlistCount: number = 0;
  cartCount: number = 0;
  activeDropdown: string | null = null;

  // Search properties
  searchTerm: string = '';
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  isSearching: boolean = false;

  // Thêm biến kiểm tra trạng thái loading khi kiểm tra token
  isCheckingAuth: boolean = false;

  @ViewChild('searchBox') searchBox!: ElementRef;

  // Thời gian trễ để tránh dropdown đóng ngay lập tức
  private dropdownTimeout: any;
  private dropdownHideDelay: number = 500; // Kéo dài thời gian trễ

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private elementRef: ElementRef
  ) { }

  private http = inject(HttpClient);

  ngOnInit() {
    this.wishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistCount = wishlist.length;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.length;
    });

    // Subscribe to search results
    this.searchService.searchResults$.subscribe(results => {
      this.searchResults = results;
      this.isSearching = false;
      this.showSearchResults = results.length > 0;
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

  // Search functions
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isSearching = true;
      this.searchService.search(this.searchTerm);
    } else {
      this.clearSearch();
    }
  }

  onSearchInputFocus(): void {
    if (this.searchResults.length > 0) {
      this.showSearchResults = true;
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }

  // Hide search results when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSearchResults = false;
    }
  }

  // Keep search results visible when clicking inside the search container
  onSearchContainerClick(event: Event): void {
    event.stopPropagation();
  }

  addProductToCompare(product: any): void {
    // This will be handled by the laptop-item component
    console.log('Adding product to compare:', product);
  }

  goToCart(): void {
    const cartCount = this.cartService.getCart().length;
    
    // Kiểm tra nếu giỏ hàng trống trước
    if (cartCount === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Giỏ hàng trống',
        detail: 'Giỏ hàng của bạn đang trống',
        life: 3000
      });
      return;
    }

    // Ngăn chặn nhiều lần nhấp
    if (this.isCheckingAuth) {
      return;
    }
    
    this.isCheckingAuth = true;
    
    // Kiểm tra token có hiệu lực không
    this.authService.isTokenValid()
      .pipe(
        finalize(() => {
          this.isCheckingAuth = false;  // Reset trạng thái dù thành công hay thất bại
        })
      )
      .subscribe(isValid => {
        if (isValid) {
          // Token hợp lệ, điều hướng đến trang giỏ hàng
          this.router.navigate(['/gio-hang']);
        } else {
          // Token không hợp lệ hoặc đã hết hạn
          this.messageService.add({
            severity: 'warn',
            summary: 'Yêu cầu đăng nhập',
            detail: 'Vui lòng đăng nhập lại để xem giỏ hàng của bạn',
            life: 5000
          });
          
          // Điều hướng đến trang đăng nhập với query param cho biết phiên đã hết hạn
          this.router.navigate(['/dang-nhap'], { 
            queryParams: { sessionExpired: true, returnUrl: '/gio-hang' } 
          });
        }
      });
  }

goToAccount(): void {
  // Ngăn chặn nhiều lần nhấp
  if (this.isCheckingAuth) {
    return;
  }

  this.isCheckingAuth = true;

  this.authService.isTokenValid()
    .pipe(
      finalize(() => {
        this.isCheckingAuth = false; // Reset trạng thái
      })
    )
    .subscribe(isValid => {
      if (isValid) {
        // Token hợp lệ, điều hướng đến trang tài khoản
        this.router.navigate(['/account']);
      } else {
        this.router.navigate(['/login'])
      }
    });
}

}