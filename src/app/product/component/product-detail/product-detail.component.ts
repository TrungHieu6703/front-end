// product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';

interface ProductSpecification {
  name: string;
  value: string;
}

interface ProductOption {
  id: number;
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  images: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  status: string;
  warranty: string;
  shortDescription: string;
  specifications: ProductSpecification[];
  highlights: string[];
  gift: string[];
  options: ProductOption[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    ImageModule,
    BadgeModule
  ],
    templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product = {
    id: 1205,
    name: 'Lenovo IdeaPad Slim 3 Ryzen 7 8745HS 16 FHD 83K9',
    images: [
      '/assets/images/lenovo-ideapad-slim3-1.jpg',
      '/assets/images/lenovo-ideapad-slim3-2.jpg',
      '/assets/images/lenovo-ideapad-slim3-3.jpg',
      '/assets/images/lenovo-ideapad-slim3-4.jpg'
    ],
    price: 12990000,
    originalPrice: 13990000,
    discountPercent: 7,
    status: 'Còn hàng',
    warranty: '12 tháng',
    shortDescription: 'Laptop Lenovo IdeaPad Slim 3 (82XR002TVN) được thiết kế cho phong cách làm việc hiện đại với hiệu năng mạnh mẽ từ CPU AMD Ryzen 7 8745HS, 16GB RAM, SSD 512GB và màn hình 14 inch Full HD.',
    specifications: [
      { name: 'CPU', value: 'AMD Ryzen 7 8745HS (8 nhân 16 luồng, 3.8GHz - 5.1GHz, 16MB Cache)' },
      { name: 'RAM', value: '16GB LPDDR5X 7500MHz (Onboard)' },
      { name: 'Ổ cứng', value: '512GB M.2 2242 PCIe 4.0x4 NVMe SSD' },
      { name: 'Màn hình', value: '14" FHD (1920x1080) IPS 300 nits Anti-glare, 60Hz' },
      { name: 'Card đồ họa', value: 'AMD Radeon Graphics (Tích hợp)' },
      { name: 'Cổng kết nối', value: '1x USB-C 3.2 Gen 1, 1x USB-C 3.2 Gen 2, 2x USB-A 3.2 Gen 1, HDMI 1.4b, Headphone/microphone combo jack' },
      { name: 'Kết nối không dây', value: 'Wi-Fi 6 (802.11ax), Bluetooth 5.1' },
      { name: 'Hệ điều hành', value: 'Windows 11 Home' },
      { name: 'Pin', value: '47Wh, sạc nhanh 65W' },
      { name: 'Kích thước', value: '324.3 x 213.8 x 17.9 mm' },
      { name: 'Trọng lượng', value: '1.37 kg' },
      { name: 'Màu sắc', value: 'Xám (Cloud Grey)' },
      { name: 'Tính năng khác', value: 'Bàn phím có đèn nền, Webcam FHD 1080p với Privacy Shutter, Dolby Audio' }
    ],
    highlights: [
      'AMD Ryzen 7 8745HS mạnh mẽ cho đa nhiệm và xử lý đồ họa',
      'RAM 16GB LPDDR5X tốc độ cao cho hiệu suất mượt mà',
      'Màn hình 14" Full HD IPS với độ sáng 300 nits, chống chói',
      'Thiết kế siêu mỏng nhẹ chỉ 1.37kg, dễ dàng di chuyển',
      'Pin 47Wh cho thời lượng làm việc liên tục đến 8 giờ'
    ],
    gift: [
      'Túi đựng laptop',
      'Chuột không dây Lenovo',
      'Phiếu giảm giá 200.000đ cho lần mua hàng tiếp theo'
    ],
    options: [
      { id: 1, name: 'RAM 16GB / SSD 512GB', price: 12990000 },
      { id: 2, name: 'RAM 16GB / SSD 1TB', price: 14490000 }
    ]
  };

  selectedImageIndex = 0;
  selectedOption = 1;

  constructor() { }

  ngOnInit(): void {
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  selectOption(optionId: number): void {
    this.selectedOption = optionId;
    // Trong thực tế sẽ cập nhật giá tiền tương ứng với option
  }

  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}