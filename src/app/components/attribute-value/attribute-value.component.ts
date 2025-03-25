import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AttributeValue } from '../../interface/attribute-value';
import { AttributeValueService } from '../../services/attribute-value.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-attribute-value',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, AttributeValueService],
  templateUrl: './attribute-value.component.html',
  styleUrls: ['./attribute-value.component.css']
})
export class AttributeValueComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  attributeValueDialog: boolean = false;
  attributeValues: AttributeValue[] = [];
  attributeValue: AttributeValue = {};
  selectedAttributeValues: AttributeValue[] | null = null;
  submitted: boolean = false;

  constructor(
    private attributeValueService: AttributeValueService,
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
    this.attributeValueService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.attributeValues = response.data; // Lấy đúng mảng `data`
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.attributeValues = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }
  

  openNew() {
    this.attributeValue = {};
    this.submitted = false;
    this.attributeValueDialog = true;
  }

  deleteSelectedAttributes() {
    if (!this.selectedAttributeValues || this.selectedAttributeValues.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các thuộc tính đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteCount = 0;
        this.selectedAttributeValues!.forEach((attr) => {
          if (attr.id) {
            this.attributeValueService.deletePost(attr.id).subscribe({
              next: () => {
                deleteCount++;
                if (deleteCount === this.selectedAttributeValues!.length) {
                  this.loadAttributes(); // Load lại danh sách khi xóa xong
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa các thuộc tính đã chọn',
                    life: 3000,
                  });
                  this.selectedAttributeValues = null;
                }
              },
              error: (err) => console.error(`Lỗi khi xóa ${attr.value}:`, err),
            });
          }
        });
      },
    });
  }

  editAttributeValue(attributeValue: AttributeValue) {
    this.attributeValue = { ...attributeValue };
    this.attributeValueDialog = true;
  }

  deleteAttribute(attributeValue: AttributeValue) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${attributeValue.value}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (attributeValue.id) {
          console.log(attributeValue.id)
          this.attributeValueService.deletePost(attributeValue.id).subscribe({
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
    this.attributeValueDialog = false;
    this.submitted = false;
  }

  saveAttribute() {
    this.submitted = true;

    if (this.attributeValue.value?.trim()) {
      if (this.attributeValue.id) {
        this.attributeValueService.update(this.attributeValue.id, this.attributeValue).subscribe({
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
        this.attributeValueService.create(this.attributeValue).subscribe({
          next: (id) => {
            this.attributeValue.id = id;
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

      this.attributeValueDialog = false;
      console.log(this.attributeValue)
      this.attributeValue = {};
    }
  }
}
