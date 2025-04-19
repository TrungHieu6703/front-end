import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Brand } from '../../interface/brand';
import { BrandService } from '../../services/brand.service';
import { ProductLineService } from '../../services/product-line.service';
import { Table } from 'primeng/table';

interface ProductLine {
  id?: string;
  line_name?: string;
  brandId?: string;
}

@Component({
  selector: 'app-brand-manager',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, BrandService, ProductLineService],
  templateUrl: './brand-manager.component.html',
  styleUrls: ['./brand-manager.component.css']
})
export class BrandManagerComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  // Brand related properties
  brandDialog: boolean = false;
  brands: Brand[] = [];
  brand: Brand = {};
  selectedBrands: Brand[] | null = null;
  
  // Product Line related properties
  productLineDialog: boolean = false;
  productLines: {[key: string]: ProductLine[]} = {}; // Map brand ID to its product lines
  productLine: ProductLine = {};
  selectedProductLine: ProductLine | null = null;
  currentBrandId: string = '';

  submitted: boolean = false;
  activeIndex: number[] = [];

  constructor(
    private brandService: BrandService,
    private productLineService: ProductLineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.brands = response.data;
          // Load product lines for each brand
          this.brands.forEach(brand => {
            if (brand.id) {
              this.loadProductLines(brand.id);
            }
          });
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.brands = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thương hiệu:', err),
    });
  }

  loadProductLines(brandId: string) {
    this.productLineService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          // Filter product lines by brandId
          const filteredLines = response.data.filter(pl => pl.brandId === brandId);
          this.productLines[brandId] = filteredLines;
          console.log(this.productLines[brandId])
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.productLines[brandId] = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu dòng sản phẩm:', err),
    });
  }

  // Brand methods
  openNew() {
    this.brand = {};
    this.submitted = false;
    this.brandDialog = true;
  }

  deleteSelectedBrands() {
    if (!this.selectedBrands || this.selectedBrands.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các thương hiệu đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteCount = 0;
        this.selectedBrands!.forEach((brand) => {
          if (brand.id) {
            this.brandService.deletePost(brand.id).subscribe({
              next: () => {
                deleteCount++;
                if (deleteCount === this.selectedBrands!.length) {
                  this.loadBrands(); // Reload list after deletion
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa các thương hiệu đã chọn',
                    life: 3000,
                  });
                  this.selectedBrands = null;
                }
              },
              error: (err) => console.error(`Lỗi khi xóa ${brand.name}:`, err),
            });
          }
        });
      },
    });
  }

  editBrand(brand: Brand) {
    this.brand = { ...brand };
    this.brandDialog = true;
  }

  deleteBrand(brand: Brand) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${brand.name}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (brand.id) {
          this.brandService.deletePost(brand.id).subscribe({
            next: () => {
              this.loadBrands(); // Reload list after deletion
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã xóa thương hiệu',
                life: 3000,
              });
            },
            error: (err) => console.error('Lỗi khi xóa thương hiệu:', err),
          });
        }
      },
    });
  }

  hideDialog() {
    this.brandDialog = false;
    this.productLineDialog = false;
    this.submitted = false;
  }

  saveBrand() {
    this.submitted = true;

    if (this.brand.name?.trim()) {
      if (this.brand.id) {
        this.brandService.update(this.brand.id, this.brand).subscribe({
          next: () => {
            this.loadBrands();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã cập nhật thương hiệu',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi cập nhật:', err),
        });
      } else {
        this.brandService.create(this.brand).subscribe({
          next: (id) => {
            this.brand.id = id;
            this.loadBrands();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã thêm thương hiệu',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi tạo thương hiệu:', err),
        });
      }

      this.brandDialog = false;
      this.brand = {};
    }
  }

  // Product Line methods
  openNewProductLine(brandId: string) {
    this.productLine = { brandId };
    this.currentBrandId = brandId;
    this.submitted = false;
    this.productLineDialog = true;
  }

  editProductLine(productLine: ProductLine) {
    this.productLine = { ...productLine };
    this.currentBrandId = productLine.brandId || '';
    this.productLineDialog = true;
  }

  deleteProductLine(productLine: ProductLine) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa dòng sản phẩm này?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (productLine.id) {
          this.productLineService.deletePost(productLine.id).subscribe({
            next: () => {
              if (productLine.brandId) {
                this.loadProductLines(productLine.brandId);
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã xóa dòng sản phẩm',
                life: 3000,
              });
            },
            error: (err) => console.error('Lỗi khi xóa dòng sản phẩm:', err),
          });
        }
      },
    });
  }

  saveProductLine() {
    this.submitted = true;

    if (this.productLine.line_name?.trim()) {
      // Ensure brandId is set
      this.productLine.brandId = this.currentBrandId;

      if (this.productLine.id) {
        this.productLineService.update(this.productLine.id, this.productLine).subscribe({
          next: () => {
            this.loadProductLines(this.currentBrandId);
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã cập nhật dòng sản phẩm',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi cập nhật dòng sản phẩm:', err),
        });
      } else {
        this.productLineService.create(this.productLine).subscribe({
          next: (id) => {
            this.productLine.id = id;
            this.loadProductLines(this.currentBrandId);
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã thêm dòng sản phẩm',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi tạo dòng sản phẩm:', err),
        });
      }

      this.productLineDialog = false;
      this.productLine = {};
    }
  }

  expandAccordion(index: number) {
    if (this.activeIndex.includes(index)) {
      this.activeIndex = this.activeIndex.filter(i => i !== index);
    } else {
      this.activeIndex.push(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.activeIndex.includes(index);
  }
}