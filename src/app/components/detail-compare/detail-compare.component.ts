
import { Component, inject, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompareService, ProductCompare } from '../../services/product-compare.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { LaptopItemComponent } from '../laptop-item/laptop-item.component';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-detail-compare',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LaptopItemComponent, HeaderComponent],
  templateUrl: './detail-compare.component.html',
  styleUrls: ['./detail-compare.component.css']
})
export class DetailCompareComponent implements OnInit {
  @ViewChild('searchBox') searchBox!: ElementRef;

  products: ProductCompare[] = [];
  attributes: string[] = [];
  loading = false;
  error: string | null = null;
  maxProductsToCompare = 4;


  searchTerm: string = '';
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  isSearching: boolean = false;

  // Thời gian trễ để tránh dropdown đóng ngay lập tức
  private dropdownTimeout: any;
  private dropdownHideDelay: number = 500; // Kéo dài thời gian trễ

  activeDropdown: string | null = null;

  // Biến cho modal tìm kiếm
  showSearchModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private compareService: CompareService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.loading = true;

    this.searchService.searchResults$.subscribe(results => {
      this.searchResults = results;
      this.isSearching = false;
      this.showSearchResults = results.length > 0;
    });

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

  // Mở modal tìm kiếm
  openSearchModal(): void {
    this.showSearchModal = true;
    this.searchTerm = ''; // Reset search term
  }

  // Đóng modal tìm kiếm
  closeSearchModal(event: MouseEvent): void {
    // Nếu click vào overlay hoặc nút đóng
    if (
      event.target === event.currentTarget ||
      (event.target as HTMLElement).closest('.close-modal')
    ) {
      this.showSearchModal = false;
    }
  }

  showDropdown(menu: string) {
    // Xóa timeout nếu đang có
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    this.activeDropdown = menu;
  }

  keepDropdownOpen(menu: string) {
    // Xóa timeout khi di chuột vào dropdown
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    // Đảm bảo dropdown đang hiển thị
    this.activeDropdown = menu;
  }

  startHideDropdown() {
    // Tạo độ trễ khi rời khỏi menu để tạo trải nghiệm tốt hơn
    this.dropdownTimeout = setTimeout(() => {
      this.activeDropdown = null;
    }, this.dropdownHideDelay);
  }

  // Search functions
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.isSearching = true;
      this.searchService.search(this.searchTerm);
    } else {
      this.clearSearch();
    }
  }

  onSearchInputFocus(): void {
    if (this.searchResults.length > 0) {
      this.showSearchResults = true;
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }

  // Hide search results when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSearchResults = false;
    }
  }

  // Keep search results visible when clicking inside the search container
  onSearchContainerClick(event: Event): void {
    event.stopPropagation();
  }

  addProductToCompare(productToAdd: any): void {
    console.log('Attempting to add product to comparison (from detail-compare):', productToAdd.id);

    const currentIdsString = this.route.snapshot.queryParams['ids'];
    let currentIdsArray: string[] = currentIdsString ? currentIdsString.split(',') : [];
    currentIdsArray = currentIdsArray.filter(id => id.trim() !== ''); // Clean up empty IDs

    if (currentIdsArray.includes(productToAdd.id)) {
      console.warn(`Product ${productToAdd.id} is already in the comparison list.`);
      this.showSearchModal = false;
      // You might want to add a user notification here (e.g., toast message)
      return;
    }

    if (currentIdsArray.length >= this.maxProductsToCompare) {
      console.warn(`Cannot add product. Comparison list is full (max ${this.maxProductsToCompare} products).`);
      this.showSearchModal = false;
      // You might want to add a user notification here
      return;
    }

    const newIdsArray = [...currentIdsArray, productToAdd.id];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ids: newIdsArray.join(',') },
      // queryParamsHandling: 'merge' // Usually not needed if you are redefining 'ids'
      // and ngOnInit handles the full state from queryParams.
    }).then(() => {
      this.showSearchModal = false; // Close the modal
      // The component will reload data in ngOnInit due to the query parameter change.
    });
  }
}