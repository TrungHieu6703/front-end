// product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../../angular_18/product.service'
import { Product } from '../../../../../angular_18/product.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CardModule, GalleriaModule, ButtonModule, RatingModule, TableModule, MessageModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [MessageService]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = true;
  currentImageIndex: number = 0;
  
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Lấy id từ route params
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id') || '1';
      this.fetchProductDetail(productId);
    });
  }

  fetchProductDetail(id: string): void {
    this.loading = true;
    this.productService.getProductDetail(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin sản phẩm'
        });
      }
    });
  }

  calculateDiscount(currentPrice: number, originalPrice: number): string {
    if (!currentPrice || !originalPrice || currentPrice >= originalPrice) return '';
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return `-${Math.round(discount)}%`;
  }

  addToCart(): void {
    if (!this.product) return;
    
    this.productService.addToCart(this.product.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã thêm sản phẩm vào giỏ hàng!'
        });
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể thêm vào giỏ hàng'
        });
      }
    });
  }

  buyNow(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: 'Chức năng mua ngay đang được phát triển!'
    });
  }
}