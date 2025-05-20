// Thêm import DomSanitizer vào first.component.ts
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImportsModule } from '../../imports';
import { PhotoService } from './photo.service';
import { NgModel } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { EditorComponent } from '../editor/editor.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CompareService } from '../../services/product-compare.service';
import { MessageService } from 'primeng/api';
import { GalleriaModule } from 'primeng/galleria';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-first',
  standalone: true,
  imports: [ImportsModule, HeaderComponent, GalleriaModule, CommonModule, ToastModule],
  providers: [PhotoService, MessageService],
  templateUrl: './first.component.html',
  styleUrl: './first.component.css'
})
export class FirstComponent implements OnInit {
  productId: string = '';
  productDetail: any;
  productImages: any[] = [];
  productAttributes: { key: string, value: string }[] = [];
  sanitizedDescription: SafeHtml | undefined;

  // Thêm các biến mới cho gallery tùy chỉnh
  selectedImageIndex: number = 0;
  thumbnailStartIndex: number = 0;
  numVisibleThumbnails: number = 5;
  displayedThumbnails: any[] = [];

  responsiveOptions: any[] = [
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
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private compareService: CompareService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private cartService: CartService,
    private router: Router,
  ) { }

  ngOnInit() {
    // Lấy productId từ route parameter
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') || '';

      // Tải chi tiết sản phẩm
      this.fetchProductDetail(this.productId);
    });

    // Thêm event listener cho nút đóng toast messages
    this.setupToastClosers();
  }

  fetchProductDetail(id: string) {
    this.compareService.detailProduct(id).subscribe({
      next: (data) => {
        this.productDetail = data;
        console.log(this.productDetail);

        // Xử lý và sanitize description HTML
        if (this.productDetail && this.productDetail.description) {
          this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.productDetail.description);
        }

        // Xử lý dữ liệu ảnh để hiển thị trong p-galleria
        this.processProductImages();

        // Xử lý thuộc tính sản phẩm
        this.processProductAttributes();

        // Cập nhật thumbnails hiển thị
        this.updateDisplayedThumbnails();
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin sản phẩm:', err);
        this.showToast('error', 'Lỗi', 'Không thể tải thông tin sản phẩm');
      }
    });
  }

  // Xử lý mảng ảnh cho p-galleria
  processProductImages() {
    if (this.productDetail && this.productDetail.images && this.productDetail.images.length > 0) {
      this.productImages = this.productDetail.images.map((image: string) => {
        return {
          itemImageSrc: image
        };
      });
    } else {
      // Ảnh mặc định nếu không có ảnh
      this.productImages = [{
        itemImageSrc: 'assets/images/placeholder.png'
      }];
    }
  }

  // Xử lý thuộc tính sản phẩm
  processProductAttributes() {
    if (this.productDetail && this.productDetail.attributes) {
      this.productAttributes = Object.keys(this.productDetail.attributes).map(key => {
        return {
          key: key,
          value: this.productDetail.attributes[key]
        };
      });
    }
  }

  // Định dạng giá tiền
  formatPrice(price: number): string {
    if (!price) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price).replace('₫', 'đ');
  }

  // Tính phần trăm giảm giá
  calculateDiscount(currentPrice: number, originalPrice: number): string {
    if (!currentPrice || !originalPrice || currentPrice >= originalPrice) return '';
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return `-${Math.round(discount)}`;
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId)
    this.showToast('success', 'Thành công', 'Đã thêm sản phẩm vào giỏ hàng!');
  }

  buyNow(productId: string) {
    this.cartService.buyNow(productId).subscribe(isValid => {
      if (isValid) {
        this.router.navigate(['/gio-hang']);
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Yêu cầu đăng nhập',
          detail: 'Vui lòng đăng nhập để xem giỏ hàng của bạn',
          life: 5000
        });

        this.router.navigate(['/dang-nhap'], {
          queryParams: { sessionExpired: true, returnUrl: '/gio-hang' }
        });
      }
    });

  }
  // Hiển thị toast message
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  // Thiết lập event listeners cho nút đóng toast messages
  setupToastClosers() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('p-toast-icon-close')) {
        const toastMessage = target.closest('.p-toast-message');
        if (toastMessage) {
          toastMessage.remove();
        }
      }
    });
  }

  // Phương thức mới cho gallery tùy chỉnh

  // Chọn ảnh
  selectImage(index: number) {
    if (index >= 0 && index < this.productImages.length) {
      this.selectedImageIndex = index;

      // Đảm bảo thumbnail đang chọn hiển thị trong vùng nhìn thấy
      if (index < this.thumbnailStartIndex) {
        this.thumbnailStartIndex = index;
        this.updateDisplayedThumbnails();
      } else if (index >= this.thumbnailStartIndex + this.numVisibleThumbnails) {
        this.thumbnailStartIndex = index - this.numVisibleThumbnails + 1;
        this.updateDisplayedThumbnails();
      }
    }
  }

  // Điều hướng thumbnails
  navigateThumbnails(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.thumbnailStartIndex > 0) {
      this.thumbnailStartIndex--;
    } else if (direction === 'next' &&
      this.thumbnailStartIndex + this.numVisibleThumbnails < this.productImages.length) {
      this.thumbnailStartIndex++;
    }

    this.updateDisplayedThumbnails();
  }

  // Cập nhật thumbnails hiển thị
  updateDisplayedThumbnails() {
    this.displayedThumbnails = this.productImages.slice(
      this.thumbnailStartIndex,
      Math.min(this.thumbnailStartIndex + this.numVisibleThumbnails, this.productImages.length)
    );
  }
}