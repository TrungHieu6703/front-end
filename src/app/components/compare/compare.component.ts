import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { DynamicProductComponent } from '../dynamic-product/dynamic-product.component';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [NgFor, NgIf, DynamicProductComponent],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent {
  isVisibleCompare = false;
  isVisibleCompareLess = true;

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) {
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompare = state));
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompareLess = state));
  }

  btnCompareLess(){
    this.sharedService.toggleCompareStateVisibility();
    this.sharedService.toggleCompareBtnStateVisibility();
  }

  // Cập nhật kiểu dữ liệu để bao gồm id
  @Input() listCompare!: ({ id: string; image: string; name: string } | null)[];

  @Input() badge_favourite?: number;

  removeItem(i: any){
    this.listCompare[i] = null;
  }
  
  removeAllItems() {
    for (let i = 0; i < this.listCompare.length; i++) {
      this.listCompare[i] = null;
    }
  }

  compareNow() {
    // Lọc các sản phẩm không null và lấy danh sách ID
    const productIds = this.listCompare
      .filter(product => product !== null)
      .map(product => product?.id)
      .filter(id => id !== undefined); // Loại bỏ undefined

    // Kiểm tra có ít nhất 2 sản phẩm để so sánh
    if (productIds.length >= 2) {
      // Tạo query parameter ids với danh sách ID được phân tách bằng dấu phẩy
      const queryParams = { ids: productIds.join(',') };
      
      // Điều hướng đến trang compare với query parameters
      this.router.navigate(['/detail-compare'], { queryParams });
    } else {
      // Hiển thị thông báo nếu chưa đủ sản phẩm để so sánh
      alert('Vui lòng chọn ít nhất 2 sản phẩm để so sánh');
    }
  }
}