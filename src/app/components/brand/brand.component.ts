import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Brand } from '../../interface/brand';
import { BrandService } from '../../services/brand.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, BrandService],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css'
})
export class BrandComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  brandDialog: boolean = false;
  brands: Brand[] = [];
  brand: Brand = {};
  selectedBrands: Brand[] | null = null;
  submitted: boolean = false;

  constructor(
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.brands = response.data; // Lấy đúng mảng `data`
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.brands = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }
  

  openNew() {
    this.brand = {};
    this.submitted = false;
    this.brandDialog = true;
  }

  deleteSelectedBrands() {
    if (!this.selectedBrands || this.selectedBrands.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các thuộc tính đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteCount = 0;
        this.selectedBrands!.forEach((attr) => {
          if (attr.id) {
            this.brandService.deletePost(attr.id).subscribe({
              next: () => {
                deleteCount++;
                if (deleteCount === this.selectedBrands!.length) {
                  this.loadBrands(); // Load lại danh sách khi xóa xong
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa các thuộc tính đã chọn',
                    life: 3000,
                  });
                  this.selectedBrands = null;
                }
              },
              error: (err) => console.error(`Lỗi khi xóa ${attr.name}:`, err),
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
          console.log(brand.id)
          this.brandService.deletePost(brand.id).subscribe({
            next: () => {
              this.loadBrands(); // Load lại danh sách sau khi xóa
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã xóa thuộc tính',
                life: 3000,
              });
            },
            error: (err) => console.error('Lỗi khi xóa thuộc tính:', err),
          });
        }
      },
    });
  }

  hideDialog() {
    this.brandDialog = false;
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
              detail: 'Đã cập nhật thuộc tính',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi cập nhật:', err),
        });
      } else {
        console.log(this.brand)
        this.brandService.create(this.brand).subscribe({
          next: (id) => {
            this.brand.id = id;
            this.loadBrands();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã thêm thuộc tính',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi tạo thuộc tính:', err),
        });
      }

      this.brandDialog = false;
      this.brand = {};
    }
  }
}
