import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports'
import { ConfirmationService, MessageService } from 'primeng/api';
import { AttributeValue } from '../../interface/attribute-value';
import { AttributeValueService } from '../../services/attribute-value.service';
import { Attribute } from '../../interface/attribute';
import { AttributeService } from '../../services/attribute.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-attribute-value-crud',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, AttributeValueService, AttributeService],
  templateUrl: './attribute-value-crud.component.html',
  styleUrls: ['./attribute-value-crud.component.css']
})
export class AttributeValueCrudComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  attributeValueDialog: boolean = false;
  attributeValues: AttributeValue[] = [];
  attributeValue: AttributeValue = {};
  selectedAttributeValues: AttributeValue[] | null = null;
  submitted: boolean = false;
  
  attributes: Attribute[] = [];
  selectedAttribute: Attribute | null = null;
  
  filteredAttributeValues: AttributeValue[] = [];

  constructor(
    private attributeValueService: AttributeValueService,
    private attributeService: AttributeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit() {
    this.loadAttributes();
    this.loadAttributeValues();
  }

  loadAttributes() {
    this.attributeService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.attributes = response.data;
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.attributes = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }

  loadAttributeValues() {
    this.attributeValueService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.attributeValues = response.data;
          this.filterAttributeValues();
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.attributeValues = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu giá trị thuộc tính:', err),
    });
  }

  onAttributeChange() {
    this.filterAttributeValues();
  }

  filterAttributeValues() {
    if (this.selectedAttribute) {
      this.filteredAttributeValues = this.attributeValues.filter(
        av => av.attributeId === this.selectedAttribute?.id
      );
    } else {
      this.filteredAttributeValues = [...this.attributeValues];
    }
  }

  openNew() {
    this.attributeValue = {
      attributeId: this.selectedAttribute?.id || ''
    };
    this.submitted = false;
    this.attributeValueDialog = true;
  }

  deleteSelectedAttributeValues() {
    if (!this.selectedAttributeValues || this.selectedAttributeValues.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các giá trị thuộc tính đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteCount = 0;
        this.selectedAttributeValues!.forEach((attrValue) => {
          if (attrValue.id) {
            this.attributeValueService.deletePost(attrValue.id).subscribe({
              next: () => {
                deleteCount++;
                if (deleteCount === this.selectedAttributeValues!.length) {
                  this.loadAttributeValues(); // Load lại danh sách khi xóa xong
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa các giá trị thuộc tính đã chọn',
                    life: 3000,
                  });
                  this.selectedAttributeValues = null;
                }
              },
              error: (err) => console.error(`Lỗi khi xóa ${attrValue.value}:`, err),
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

  deleteAttributeValue(attributeValue: AttributeValue) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa giá trị "${attributeValue.value}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (attributeValue.id) {
          this.attributeValueService.deletePost(attributeValue.id).subscribe({
            next: () => {
              this.loadAttributeValues(); // Load lại danh sách sau khi xóa
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã xóa giá trị thuộc tính',
                life: 3000,
              });
            },
            error: (err) => console.error('Lỗi khi xóa giá trị thuộc tính:', err),
          });
        }
      },
    });
  }

  hideDialog() {
    this.attributeValueDialog = false;
    this.submitted = false;
  }

  saveAttributeValue() {
    this.submitted = true;

    if (this.attributeValue.value?.trim() && this.attributeValue.attributeId) {
      if (this.attributeValue.id) {
        // Cập nhật
        this.attributeValueService.update(this.attributeValue.id, this.attributeValue).subscribe({
          next: () => {
            this.loadAttributeValues();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã cập nhật giá trị thuộc tính',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi cập nhật:', err),
        });
      } else {
        // Thêm mới
        this.attributeValueService.create(this.attributeValue).subscribe({
          next: (id) => {
            this.attributeValue.id = id;
            this.loadAttributeValues();
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã thêm giá trị thuộc tính',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi tạo giá trị thuộc tính:', err),
        });
      }

      this.attributeValueDialog = false;
      this.attributeValue = {};
    }
  }

  getAttributeName(attributeId: string | undefined): string {
    if (!attributeId) return 'N/A';
    const attribute = this.attributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.name || 'N/A' : 'N/A';
  }
}