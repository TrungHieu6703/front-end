import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompareService, ProductCompare } from '../../services/product-compare.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-compare',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-compare.component.html',
  styleUrls: ['./detail-compare.component.scss']
})
export class DetailCompareComponent implements OnInit {
  products: ProductCompare[] = [];
  attributes: string[] = [];
  loading = false;
  error: string | null = null;
  maxProductsToCompare = 4;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compareService: CompareService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    
    this.route.queryParams.subscribe(params => {
      const ids = params['ids'];
      
      if (ids) {
        const productIds = ids.split(',');
        if (productIds.length >= 2 && productIds.length <= this.maxProductsToCompare) {
          this.compareService.compareProducts(productIds).subscribe({
            next: (data) => {
              this.products = data;
              
              // Lấy tất cả các thuộc tính duy nhất từ sản phẩm
              this.extractAllAttributes();
              
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Không thể tải dữ liệu so sánh';
              this.loading = false;
              console.error('Lỗi khi tải dữ liệu so sánh:', err);
            }
          });
        } else {
          this.error = `Số lượng sản phẩm để so sánh phải từ 2 đến ${this.maxProductsToCompare}`;
          this.loading = false;
        }
      } else {
        this.error = 'Không có sản phẩm nào được chọn để so sánh';
        this.loading = false;
      }
    });
  }

  // Lấy tất cả các thuộc tính duy nhất từ các sản phẩm
  extractAllAttributes(): void {
    const attributeSet = new Set<string>();
    
    // Thu thập tất cả tên thuộc tính
    this.products.forEach(product => {
      if (product.attributes) {
        Object.keys(product.attributes).forEach(attr => attributeSet.add(attr));
      }
    });
    
    // Chuyển Set sang Array và sắp xếp
    this.attributes = Array.from(attributeSet).sort();
  }

  // Lấy giá trị thuộc tính của sản phẩm, trả về '-' nếu không có
  getAttributeValue(product: ProductCompare, attribute: string): string {
    if (product.attributes && product.attributes[attribute]) {
      return product.attributes[attribute];
    }
    return '-';
  }

  // Format giá tiền
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  // Xóa sản phẩm khỏi so sánh
  removeFromCompare(productId: string): void {
    const currentIds = this.route.snapshot.queryParams['ids'].split(',');
    const updatedIds = currentIds.filter((id: string) => id !== productId);
    
    if (updatedIds.length < 2) {
      // Nếu còn ít hơn 2 sản phẩm, chuyển về trang sản phẩm
      this.router.navigate(['/products']);
    } else {
      // Cập nhật URL với danh sách ID mới
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ids: updatedIds.join(',') },
        queryParamsHandling: 'merge'
      });
    }
  }
}