import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

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
    private cartSubject = new BehaviorSubject<string[]>([]);  // Lưu trữ danh sách ID sản phẩm
    cart$: Observable<string[]> = this.cartSubject.asObservable();

    private cartCountSubject = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCountSubject.asObservable(); // Observable để theo dõi số lượng

    get cartCount(): number {
        return this.cartSubject.value.length;
    }

    constructor(private cookieService: CookieService) {
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

    isInCart(productId: string): boolean {
        return this.cartSubject.value.includes(productId);
    }

    getCart(): string[] {
        return this.cartSubject.value;
    }
}