import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from '../../interface/category'; // Đảm bảo interface Category có thuộc tính parentId? : string;
import { CategoryService } from '../../services/category.service';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs'; // Import forkJoin

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
  categories: Category[] = []; // Danh sách tất cả danh mục
  category: Category = {};
  selectedCategories: Category[] | null = null;
  submitted: boolean = false;

  // === PHẦN THÊM MỚI ===
  parentCategoryOptions: Category[] = []; // Danh sách các danh mục có thể làm cha
  // === KẾT THÚC PHẦN THÊM MỚI ===

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit() {
    this.loadInitialData(); // Gọi hàm mới để tải dữ liệu ban đầu
  }

  // === HÀM MỚI: Tải tất cả danh mục ===
  loadInitialData() {
    this.categoryService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.categories = response.data;
          // Lọc danh sách danh mục có thể làm cha (ví dụ: chỉ lấy cấp 1 hoặc tất cả trừ chính nó khi edit)
          // Bạn có thể tùy chỉnh logic lọc ở đây nếu cần (ví dụ: chỉ cho chọn cấp 1)
          this.parentCategoryOptions = this.categories; 
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.categories = [];
          this.parentCategoryOptions = [];
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu danh mục:', err);
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách danh mục', life: 3000 });
      }
    });
  }
  // === KẾT THÚC HÀM MỚI ===


  // === CẬP NHẬT: loadCategories giờ chỉ dùng để refresh ===
  loadCategories() {
     this.loadInitialData(); // Gọi lại hàm tải dữ liệu
  }
  // === KẾT THÚC CẬP NHẬT ===
  

  openNew() {
    this.category = {};
    this.submitted = false;
    // === CẬP NHẬT: Lọc danh sách cha khi thêm mới ===
    // Lấy tất cả danh mục làm lựa chọn cha
    this.parentCategoryOptions = [...this.categories]; 
    // === KẾT THÚC CẬP NHẬT ===
    this.categoryDialog = true;
  }

  deleteSelectedCategories() {
    // ... (Giữ nguyên logic xóa đã chọn)
     if (!this.selectedCategories || this.selectedCategories.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các danh mục đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Sử dụng forkJoin để xử lý nhiều yêu cầu xóa song song
        const deleteObservables = this.selectedCategories!
          .map(cat => cat.id ? this.categoryService.deletePost(cat.id) : null)
          .filter(obs => obs !== null); // Loại bỏ các giá trị null nếu có id không hợp lệ

        if (deleteObservables.length > 0) {
          forkJoin(deleteObservables).subscribe({
            next: () => {
              this.loadCategories(); // Load lại danh sách khi xóa xong
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: `Đã xóa ${deleteObservables.length} danh mục đã chọn`,
                life: 3000,
              });
              this.selectedCategories = null;
            },
            error: (err) => {
               console.error(`Lỗi khi xóa hàng loạt:`, err);
               this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Xảy ra lỗi khi xóa một số danh mục', life: 3000 });
            }
          });
        }
      },
    });
  }

  editCategory(category: Category) {
    this.category = { ...category };
    // === CẬP NHẬT: Lọc danh sách cha khi sửa ===
    // Loại bỏ chính danh mục đang sửa khỏi danh sách chọn làm cha
    // Bạn có thể thêm logic phức tạp hơn để loại bỏ cả các danh mục con của nó nếu cần
    this.parentCategoryOptions = this.categories.filter(cat => cat.id !== category.id); 
    // === KẾT THÚC CẬP NHẬT ===
    this.categoryDialog = true;
  }

  deleteCategory(category: Category) {
     // ... (Giữ nguyên logic xóa đơn)
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
                detail: 'Đã xóa danh mục',
                life: 3000,
              });
            },
            error: (err) => {
                 console.error('Lỗi khi xóa danh mục:', err);
                 this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa danh mục', life: 3000 });
            }
          });
        }
      },
    });
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
    this.category = {}; // Reset category object
  }

  saveCategory() {
    this.submitted = true;

    if (this.category.name?.trim()) {
      // === CẬP NHẬT: Đảm bảo parentId là null nếu không chọn ===
      if (this.category.parentId === undefined || this.category.parentId === '') {
           this.category.parentId = null; // Hoặc giá trị phù hợp với backend của bạn
      }
      // === KẾT THÚC CẬP NHẬT ===

      if (this.category.id) {
        // === CẬP NHẬT: Gửi cả parentId khi update ===
        this.categoryService.update(this.category.id, this.category).subscribe({
          next: () => {
            this.loadCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã cập nhật danh mục',
              life: 3000,
            });
             this.hideDialog(); // Đóng dialog sau khi thành công
          },
          error: (err) => {
             console.error('Lỗi khi cập nhật:', err);
             this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật danh mục', life: 3000 });
          },
        });
      } else {
         // === CẬP NHẬT: Gửi cả parentId khi create ===
        this.categoryService.create(this.category).subscribe({
          next: (newCategory) => { // Giả sử API trả về danh mục mới với ID
            this.loadCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã thêm danh mục',
              life: 3000,
            });
            this.hideDialog(); // Đóng dialog sau khi thành công
          },
          error: (err) => {
            console.error('Lỗi khi tạo danh mục:', err);
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tạo danh mục', life: 3000 });
          },
        });
      }

      // Không đóng dialog ở đây nữa, chuyển vào trong .subscribe()
      // this.categoryDialog = false;
      // this.category = {};
    } else {
        this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên danh mục', life: 3000 });
    }
  }

  // Tùy chọn: Thêm hàm kiểm tra nếu đang sửa danh mục cấp 1
  /*
  isEditingLevelOne(): boolean {
      return !!this.category.id && !this.category.parentId;
  }
  */
}