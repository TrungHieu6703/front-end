import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

interface Product {
    id: string;
    name: string;
    image?: string;
    avatar?: string;
    price: number;
    is_compare: boolean;
    category?: string;
    brand?: string;
    quantity?: number;
    is_hot?: boolean;
    description?: string;
    specs_summary?: string;
    discount?: number;
    oldPrice?: number;
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private wishlistSubject = new BehaviorSubject<Product[]>([]);
    wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();

    private wishlistCountSubject = new BehaviorSubject<number>(0);
    wishlistCount$ = this.wishlistCountSubject.asObservable();

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
        this.wishlistCountSubject.next(loadedWishlist.length);
    }

    toggleWishlist(product: Product) {
        const currentWishlist = this.wishlistSubject.value;
        const existingProductIndex = currentWishlist.findIndex(item => item.id === product.id);

        let updatedWishlist;
        if (existingProductIndex > -1) {
            updatedWishlist = currentWishlist.filter(item => item.id !== product.id);
        } else {
            updatedWishlist = [...currentWishlist, product];
        }

        this.wishlistSubject.next(updatedWishlist);
        this.wishlistCountSubject.next(updatedWishlist.length);
        this.saveWishlist();
    }

    removeFromWishlist(product: Product) {
        const currentWishlist = this.wishlistSubject.value;
        const updatedWishlist = currentWishlist.filter(item => item.id !== product.id);

        this.wishlistSubject.next(updatedWishlist);
        this.wishlistCountSubject.next(updatedWishlist.length);
        this.saveWishlist();
    }

    // Thêm method để xóa theo ID
    removeFromWishlistById(productId: string) {
        const currentWishlist = this.wishlistSubject.value;
        const updatedWishlist = currentWishlist.filter(item => item.id !== productId);

        this.wishlistSubject.next(updatedWishlist);
        this.wishlistCountSubject.next(updatedWishlist.length);
        this.saveWishlist();
    }

    isInWishlist(productId: string): boolean {
        return this.wishlistSubject.value.some(item => item.id === productId);
    }

    getWishlist(): Product[] {
        return this.wishlistSubject.value;
    }
}