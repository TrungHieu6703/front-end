import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Attribute } from '../interface/attribute';
import { AttributeService } from '../services/attribute.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, AttributeService],
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'] // Sửa lỗi styleUrl -> styleUrls
})
export class CrudComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  attributeDialog: boolean = false;
  attributes: Attribute[] = [];
  attribute: Attribute = {};
  selectedAttributes: Attribute[] | null = null;
  submitted: boolean = false;

  constructor(
    private attributeService: AttributeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit() {
    this.loadAttributes();
  }

  loadAttributes() {
    this.attributeService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.attributes = response.data; // Lấy đúng mảng `data`
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.attributes = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }
  

  openNew() {
    this.attribute = {};
    this.submitted = false;
    this.attributeDialog = true;
  }

  deleteSelectedAttributes() {
    if (!this.selectedAttributes || this.selectedAttributes.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các thuộc tính đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteCount = 0;
        this.selectedAttributes!.forEach((attr) => {
          if (attr.id) {
            this.attributeService.deletePost(attr.id).subscribe({
              next: () => {
                deleteCount++;
                if (deleteCount === this.selectedAttributes!.length) {
                  this.loadAttributes(); // Load lại danh sách khi xóa xong
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa các thuộc tính đã chọn',
                    life: 3000,
                  });
                  this.selectedAttributes = null;
                }
              },
              error: (err) => console.error(`Lỗi khi xóa ${attr.name}:`, err),
            });
          }
        });
      },
    });
  }

  editAttribute(attribute: Attribute) {
    this.attribute = { ...attribute };
    this.attributeDialog = true;
  }

  deleteAttribute(attribute: Attribute) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${attribute.name}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (attribute.id) {
          console.log(attribute.id)
          this.attributeService.deletePost(attribute.id).subscribe({
            next: () => {
              this.loadAttributes(); // Load lại danh sách sau khi xóa
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
    this.attributeDialog = false;
    this.submitted = false;
  }

  saveAttribute() {
    this.submitted = true;

    if (this.attribute.name?.trim()) {
      if (this.attribute.id) {
        this.attributeService.update(this.attribute.id, this.attribute).subscribe({
          next: () => {
            this.loadAttributes();
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
        this.attributeService.create(this.attribute).subscribe({
          next: (id) => {
            this.attribute.id = id;
            this.loadAttributes();
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

      this.attributeDialog = false;
      this.attribute = {};
    }
  }
}
