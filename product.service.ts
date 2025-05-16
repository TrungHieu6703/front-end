// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


// product.model.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    description: string;
    images: string[];
    attributes: Record<string, string>;
    promotions: string[];
    rating: number;
    reviewCount: number;
  }

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'api/products'; // URL thực tế sẽ thay đổi theo API của bạn

  constructor(private http: HttpClient) { }

  getProductDetail(id: string): Observable<Product> {
    // Trong môi trường thực tế, bạn sẽ gọi API thực
    // return this.http.get<Product>(`${this.apiUrl}/${id}`);
    
    // Mock data cho ví dụ
    const mockProduct: Product = {
      id: '1',
      name: 'Laptop Gaming ASUS ROG Strix G15 G513RC-HN038W',
      price: 23990000,
      originalPrice: 29990000,
      quantity: 15,
      description: '<p>Laptop Gaming ASUS ROG Strix G15 là dòng máy tính xách tay hiệu năng cao, được thiết kế đặc biệt cho game thủ với cấu hình mạnh mẽ, màn hình tần số quét cao và hệ thống tản nhiệt hiện đại.</p><p>Sở hữu bộ vi xử lý AMD Ryzen 7 6800H cùng card đồ họa NVIDIA GeForce RTX 3050 4GB, máy đủ sức chiến mọi tựa game AAA ở mức cài đặt cao. Màn hình 15.6 inch Full HD (1920 x 1080) với tần số quét 144Hz cung cấp trải nghiệm chơi game mượt mà, không bị giật lag.</p><p>Hệ thống tản nhiệt được tối ưu với công nghệ ROG Intelligent Cooling giúp máy luôn mát mẻ kể cả khi chơi game trong thời gian dài. Bàn phím gaming với đèn nền RGB có thể tùy chỉnh, tăng trải nghiệm chơi game về đêm.</p><p>Với thiết kế mỏng nhẹ, pin lâu và hệ thống âm thanh chất lượng cao, ASUS ROG Strix G15 là lựa chọn hoàn hảo cho cả gaming và công việc đòi hỏi đồ họa cao.</p>',
      images: [
        'https://trungtran.vn/upload_images/images/products/ideapad/large/Ideapad_slim_3_15cAHP10_2025%20(4).jpg',
        'https://trungtran.vn/upload_images/images/products/ideapad/large/Ideapad_slim_3_15cAHP10_2025%20(15).jpg',
        'https://trungtran.vn/upload_images/images/products/ideapad/large/Ideapad_slim_3_15cAHP10_2025%20(6).jpg'
      ],
      attributes: {
        'CPU': 'AMD Ryzen 7 6800H (8 nhân, 16 luồng, 3.2GHz, up to 4.7GHz, 16MB Cache)',
        'RAM': '16GB DDR5 4800MHz',
        'Ổ cứng': '512GB M.2 NVMe PCIe 4.0 SSD',
        'Card đồ họa': 'NVIDIA GeForce RTX 3050 4GB GDDR6',
        'Màn hình': '15.6 inch Full HD (1920 x 1080), 144Hz, Anti-glare',
        'Hệ điều hành': 'Windows 11 Home',
        'Pin': '4 Cell, 90WHrs',
        'Trọng lượng': '2.1 kg'
      },
      promotions: [
        'Tặng balo gaming ROG trị giá 1.200.000đ',
        'Chuột gaming ASUS ROG Gladius III trị giá 1.900.000đ',
        'Giảm 50% khi mua Office Home & Student 2024',
        'Trả góp 0% lãi suất trong 12 tháng'
      ],
      rating: 4.8,
      reviewCount: 128
    };

    return of(mockProduct).pipe(delay(500));
  }

  addToCart(productId: string): Observable<any> {
    // Trong môi trường thực tế, bạn sẽ gọi API thực
    // return this.http.post(`${this.apiUrl}/cart/add`, { productId });
    
    // Mock response
    return of({ success: true }).pipe(delay(300));
  }
}