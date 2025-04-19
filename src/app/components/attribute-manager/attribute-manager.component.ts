import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AttributeValue } from '../../interface/attribute-value';
import { AttributeValueService } from '../../services/attribute-value.service';
import { Attribute } from '../../interface/attribute';
import { AttributeService } from '../../services/attribute.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-attribute-manager',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService, AttributeService, AttributeValueService],
  templateUrl: './attribute-manager.component.html',
  styleUrls: ['./attribute-manager.component.css']
})
export class AttributeManagerComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  // Attribute related properties
  attributeDialog: boolean = false;
  attributes: Attribute[] = [];
  attribute: Attribute = {};
  selectedAttributes: Attribute[] | null = null;
  
  // Attribute Value related properties
  attributeValueDialog: boolean = false;
  attributeValues: {[key: string]: AttributeValue[]} = {}; // Map attribute ID to its values
  attributeValue: AttributeValue = {};
  selectedAttributeValue: AttributeValue | null = null;
  currentAttributeId: string = '';

  submitted: boolean = false;
  activeIndex: number[] = [];

  constructor(
    private attributeService: AttributeService,
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
    this.attributeService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.attributes = response.data;
          // Load attribute values for each attribute
          this.attributes.forEach(attr => {
            if (attr.id) {
              this.loadAttributeValues(attr.id);
            }
          });
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.attributes = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }

  loadAttributeValues(attributeId: string) {
    this.attributeValueService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          // Filter attribute values by attributeId
          const filteredValues = response.data.filter(av => av.attributeId === attributeId);
          this.attributeValues[attributeId] = filteredValues;
          console.log(this.attributeValues[attributeId] = filteredValues)
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.attributeValues[attributeId] = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu giá trị thuộc tính:', err),
    });
  }

  // Attribute methods
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
    this.attributeValueDialog = false;
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

  // Attribute Value methods
  openNewAttributeValue(attributeId: string) {
    this.attributeValue = { attributeId };
    this.currentAttributeId = attributeId;
    this.submitted = false;
    this.attributeValueDialog = true;
  }

  editAttributeValue(attributeValue: AttributeValue) {
    this.attributeValue = { ...attributeValue };
    this.currentAttributeId = attributeValue.attributeId || '';
    this.attributeValueDialog = true;
  }

  deleteAttributeValue(attributeValue: AttributeValue) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa giá trị này?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (attributeValue.id) {
          this.attributeValueService.deletePost(attributeValue.id).subscribe({
            next: () => {
              if (attributeValue.attributeId) {
                this.loadAttributeValues(attributeValue.attributeId);
              }
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

  saveAttributeValue() {
    this.submitted = true;

    if (this.attributeValue.value?.trim()) {
      // Ensure attributeId is set
      this.attributeValue.attributeId = this.currentAttributeId;

      if (this.attributeValue.id) {
        this.attributeValueService.update(this.attributeValue.id, this.attributeValue).subscribe({
          next: () => {
            this.loadAttributeValues(this.currentAttributeId);
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã cập nhật giá trị thuộc tính',
              life: 3000,
            });
          },
          error: (err) => console.error('Lỗi khi cập nhật giá trị thuộc tính:', err),
        });
      } else {
        this.attributeValueService.create(this.attributeValue).subscribe({
          next: (id) => {
            this.attributeValue.id = id;
            this.loadAttributeValues(this.currentAttributeId);
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