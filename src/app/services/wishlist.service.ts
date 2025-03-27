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
export class WishlistService {
    private wishlistSubject = new BehaviorSubject<Product[]>([]);
    wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();

    private wishlistCountSubject = new BehaviorSubject<number>(0);
    wishlistCount$ = this.wishlistCountSubject.asObservable(); // Observable để theo dõi số lượng

    get wishlistCount(): number {
        return this.wishlistSubject.value.length;
    }

    constructor(private cookieService: CookieService) {
        this.loadWishlist();
    }

    private saveWishlist() {
        const currentWishlist = this.wishlistSubject.value;
        this.cookieService.set('wishlist', JSON.stringify(currentWishlist));
    }

    private loadWishlist() {
        const wishlistData = this.cookieService.get('wishlist');
        const loadedWishlist = wishlistData ? JSON.parse(wishlistData) : [];
        this.wishlistSubject.next(loadedWishlist);
        this.wishlistCountSubject.next(loadedWishlist.length); // Cập nhật số lượng
    }

    toggleWishlist(product: Product) {
        const currentWishlist = this.wishlistSubject.value;
        const existingProductIndex = currentWishlist.findIndex(item => item.name === product.name);

        let updatedWishlist;
        if (existingProductIndex > -1) {
            updatedWishlist = currentWishlist.filter(item => item.name !== product.name);
        } else {
            updatedWishlist = [...currentWishlist, product];
        }

        this.wishlistSubject.next(updatedWishlist);
        this.wishlistCountSubject.next(updatedWishlist.length); // Cập nhật số lượng
        this.saveWishlist();
    }

    isInWishlist(productName: string): boolean {
        return this.wishlistSubject.value.some(item => item.name === productName);
    }

    getWishlist(): Product[] {
        return this.wishlistSubject.value;
    }
}
