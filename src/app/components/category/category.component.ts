import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from '../../interface/category';
import { CategoryService } from '../../services/category.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, CategoryService],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  categoryDialog: boolean = false;
  categories: Category[] = [];
  category: Category = {};
  selectedCategories: Category[] | null = null;
  submitted: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.categories = response.data; // Lấy đúng mảng `data`
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.categories = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }
  

  openNew() {
    this.category = {};
    this.submitted = false;
    this.categoryDialog = true;
  }

  deleteSelectedCategories() {
    if (!this.selectedCategories || this.selectedCategories.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các thuộc tính đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteCount = 0;
        this.selectedCategories!.forEach((attr) => {
          if (attr.id) {
            this.categoryService.deletePost(attr.id).subscribe({
              next: () => {
                deleteCount++;
                if (deleteCount === this.selectedCategories!.length) {
                  this.loadCategories(); // Load lại danh sách khi xóa xong
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa các thuộc tính đã chọn',
                    life: 3000,
                  });
                  this.selectedCategories = null;
                }
              },
              error: (err) => console.error(`Lỗi khi xóa ${attr.name}:`, err),
            });
          }
        });
      },
    });
  }

  editCategory(category: Category) {
    this.category = { ...category };
    this.categoryDialog = true;
  }

  deleteCategory(category: Category) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${category.name}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (category.id) {
          console.log(category.id)
          this.categoryService.deletePost(category.id).subscribe({
            next: () => {
              this.loadCategories(); // Load lại danh sách sau khi xóa
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
    this.categoryDialog = false;
    this.submitted = false;
  }

  saveCategory() {
    this.submitted = true;

    if (this.category.name?.trim()) {
      if (this.category.id) {
        this.categoryService.update(this.category.id, this.category).subscribe({
          next: () => {
            this.loadCategories();
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
        this.categoryService.create(this.category).subscribe({
          next: (id) => {
            this.category.id = id;
            this.loadCategories();
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

      this.categoryDialog = false;
      this.category = {};
    }
  }
}
