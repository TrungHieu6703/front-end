import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent implements OnInit {
  isVisibleCompare = false;
  isVisibleCompareLess = true;

  // Định nghĩa kiểu dữ liệu cho sản phẩm so sánh
  @Input() listCompare!: ({ id: string; image: string; name: string } | null)[];
  @Input() badge_favourite?: number;

  constructor(
    private sharedService: SharedService,
    private router: Router
  ) {
    this.sharedService.CompareBtnState$.subscribe((state) => {
      this.isVisibleCompare = state;
      this.isVisibleCompareLess = state;
    });
  }

  ngOnInit() {
    // Khởi tạo mảng nếu chưa có
    if (!this.listCompare || !this.listCompare.length) {
      this.listCompare = [null, null, null, null]; // Khởi tạo 4 vị trí trống
    }
  }

  // Thu gọn/mở rộng khung so sánh
  btnCompareLess() {
    this.sharedService.toggleCompareStateVisibility();
    this.sharedService.toggleCompareBtnStateVisibility();
  }

  // Xóa một sản phẩm khỏi danh sách so sánh
  removeItem(index: number) {
    if (index >= 0 && index < this.listCompare.length) {
      this.listCompare[index] = null;
    }
  }
  
  // Xóa tất cả sản phẩm khỏi danh sách so sánh
  removeAllItems() {
    if (this.listCompare && this.listCompare.length > 0) {
      // Đặt tất cả các phần tử thành null 
      for (let i = 0; i < this.listCompare.length; i++) {
        this.listCompare[i] = null;
      }
    }
  }

  // Chuyển đến trang so sánh chi tiết
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