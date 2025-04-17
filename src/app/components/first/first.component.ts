import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { PhotoService } from './photo.service';
import { NgModel } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { EditorComponent } from '../editor/editor.component';
import { ActivatedRoute } from '@angular/router';
import { CompareService } from '../../services/product-compare.service';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [ImportsModule, EditorComponent, HeaderComponent],
  providers: [PhotoService],
  templateUrl: './first.component.html',
  styleUrl: './first.component.css'
})
export class FirstComponent implements OnInit {
  productId: string = '';
  productDetail: any;
  productImages: any[] = [];
  productAttributes: {key: string, value: string}[] = [];
  
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
    private compareService: CompareService
  ) { }

  ngOnInit() {
    // Lấy productId từ route parameter
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') || '';
      
      // Tải chi tiết sản phẩm
      this.fetchProductDetail(this.productId);
    });
  }

  fetchProductDetail(id: string) {
    this.compareService.detailProduct(id).subscribe({
      next: (data) => {
        this.productDetail = data;
        console.log(this.productDetail);
        
        // Xử lý dữ liệu ảnh để hiển thị trong p-galleria
        this.processProductImages();
        
        // Xử lý thuộc tính sản phẩm
        this.processProductAttributes();
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin sản phẩm:', err);
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

  // Thêm vào giỏ hàng
  addToCart(productId: string) {
    // Xử lý thêm vào giỏ hàng ở đây
    console.log('Thêm sản phẩm vào giỏ:', productId);
    // Thêm logic lưu vào localStorage hoặc gọi API
  }
}