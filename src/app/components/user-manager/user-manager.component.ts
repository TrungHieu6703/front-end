import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserService } from '../../services/user.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, UserService],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  userDialog: boolean = false;
  categories: User[] = [];
  user: User = {};
  selectedCategories: User[] | null = null;
  submitted: boolean = false;

  constructor(
    private userService: UserService,
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
    this.userService.getPosts().subscribe({
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
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
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
            this.userService.deletePost(attr.id).subscribe({
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

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${user.name}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (user.id) {
          console.log(user.id)
          this.userService.deletePost(user.id).subscribe({
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
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name?.trim()) {
      if (this.user.id) {
        this.userService.update(this.user.id, this.user).subscribe({
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
        this.userService.create(this.user).subscribe({
          next: (id) => {
            this.user.id = id;
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

      this.userDialog = false;
      this.user = {};
    }
  }
}

