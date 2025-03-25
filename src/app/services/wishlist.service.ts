import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private cookieKey = 'wishlist';
  wishlist: any[] = [];

  constructor(private cookieService: CookieService) {
    this.loadWishlistFromCookies();
  }

  // 🔹 Đọc danh sách wishlist từ cookies
  private loadWishlistFromCookies() {
    const cookieData = this.cookieService.get(this.cookieKey);
    if (cookieData) {
      this.wishlist = JSON.parse(cookieData);
    }
  }

  // 🔹 Lưu wishlist vào cookies
  private saveWishlistToCookies() {
    this.cookieService.set(this.cookieKey, JSON.stringify(this.wishlist), 7); // Lưu trong 7 ngày
  }

  // 🔥 Thêm sản phẩm vào wishlist mà không ghi đè dữ liệu cũ
  addToWishlist(product: any) {
    // Kiểm tra xem sản phẩm đã tồn tại trong wishlist chưa
    if (!this.wishlist.some(item => item.id === product.id)) {
      this.wishlist.push(product);
      this.saveWishlistToCookies();
    }
  }

  // 🔥 Xóa sản phẩm khỏi wishlist
  removeFromWishlist(productId: number) {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    this.saveWishlistToCookies();
  }

  // 🔥 Lấy danh sách wishlist
  getWishlist() {
    return [...this.wishlist]; // Trả về bản sao để tránh thay đổi trực tiếp
  }
}
