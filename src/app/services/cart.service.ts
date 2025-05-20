import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, finalize, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
interface Product {
    id: string;      // Thêm id vào interface Product
    name: string;
    image: string;
    price: string;
    is_compare: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
      isCheckingAuth: boolean = false;

    private cartSubject = new BehaviorSubject<string[]>([]);  // Lưu trữ danh sách ID sản phẩm
    cart$: Observable<string[]> = this.cartSubject.asObservable();

    private cartCountSubject = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCountSubject.asObservable(); // Observable để theo dõi số lượng

    get cartCount(): number {
        return this.cartSubject.value.length;
    }

    constructor(private cookieService: CookieService, private router: Router,     private authService: AuthService) {
        this.loadCart();
    }

    private saveCart() {
        const currentCart = this.cartSubject.value;
        this.cookieService.set('cart', JSON.stringify(currentCart));
    }

    private loadCart() {
        const cartData = this.cookieService.get('cart');
        const loadedCart = cartData ? JSON.parse(cartData) : [];
        this.cartSubject.next(loadedCart);
        this.cartCountSubject.next(loadedCart.length); // Cập nhật số lượng
    }

    toggleCart(product: Product) {
        const currentCart = this.cartSubject.value;
        const productId = product.id;  // Sử dụng id của sản phẩm

        let updatedCart;
        if (currentCart.includes(productId)) {
            updatedCart = currentCart.filter(id => id !== productId);
        } else {
            updatedCart = [...currentCart, productId];
        }

        this.cartSubject.next(updatedCart);
        this.cartCountSubject.next(updatedCart.length); // Cập nhật số lượng
        this.saveCart();
    }

    addToCart(productId: string) {
        const currentCart = this.cartSubject.value;
        let updatedCart;
        if (currentCart.includes(productId)) {
            updatedCart = currentCart.filter(id => id !== productId);
        } else {
            updatedCart = [...currentCart, productId];
        }

        this.cartSubject.next(updatedCart);
        this.cartCountSubject.next(updatedCart.length); // Cập nhật số lượng
        this.saveCart();
    }

buyNow(productId: string): Observable<boolean> {
  if (this.isCheckingAuth) {
    return of(false);
  }

  this.isCheckingAuth = true;

  return this.authService.isTokenValid().pipe(
    finalize(() => {
      this.isCheckingAuth = false;
    }),
    map(isValid => {
      if (isValid) {
        const currentCart = this.cartSubject.value;
        if (!currentCart.includes(productId)) {
          const updatedCart = [...currentCart, productId];
          this.cartSubject.next(updatedCart);
          this.cartCountSubject.next(updatedCart.length);
          this.saveCart();
        }
        return true;
      }
      return false;
    })
  );
}


clearCart() {
  this.cartSubject.next([]);                // Clear state trong BehaviorSubject
  this.cartCountSubject.next(0);            // Reset số lượng
  this.cookieService.delete('cart');        // Xóa cookie lưu cart
}

    isInCart(productId: string): boolean {
        return this.cartSubject.value.includes(productId);
    }

    getCart(): string[] {
        return this.cartSubject.value;
    }
}