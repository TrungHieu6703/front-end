import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

interface Product {
  name: string;
  image: string;
  price: string;
  is_compare: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
    private cartSubject = new BehaviorSubject<Product[]>([]);
    cart$: Observable<Product[]> = this.cartSubject.asObservable();

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
        const existingProductIndex = currentCart.findIndex(item => item.name === product.name);

        let updatedCart;
        if (existingProductIndex > -1) {
            updatedCart = currentCart.filter(item => item.name !== product.name);
        } else {
            updatedCart = [...currentCart, product];
        }

        this.cartSubject.next(updatedCart);
        this.cartCountSubject.next(updatedCart.length); // Cập nhật số lượng
        this.saveCart();
    }

    isInCart(productName: string): boolean {
        return this.cartSubject.value.some(item => item.name === productName);
    }

    getCart(): Product[] {
        return this.cartSubject.value;
    }
}
