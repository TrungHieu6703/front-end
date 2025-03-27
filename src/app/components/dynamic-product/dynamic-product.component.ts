import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { DataService, CategoryType, AttributeType, AttributeValue, ProductAttributeValue } from '../../services/data.service'
@Component({
  selector: 'app-dynamic-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="handleSubmit()" class="space-y-6">
      <!-- Category Selection -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">
          Loại sản phẩm
        </label>
        <select 
          id="category"
          [(ngModel)]="categoryId"
          name="category"
          (ngModelChange)="onCategoryChange($event)"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">-- Chọn loại sản phẩm --</option>
          <option *ngFor="let category of categories" [value]="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Attributes Section -->
      <ng-container *ngIf="categoryId">
        <div class="mt-6">
          <h3 class="text-lg font-medium text-gray-900">
            Thuộc tính sản phẩm
          </h3>
          <div class="mt-4 space-y-4">
            <!-- Attribute Fields -->
            <div *ngFor="let attribute of currentAttributes" class="mb-6">
              <div class="flex gap-2 mb-2">
                <div class="flex-1">
                  <label 
                    [attr.for]="'attribute-' + attribute.id"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {{ attribute.name }}
                  </label>

                  <!-- Nếu có options -->
                  <select 
                    *ngIf="attribute.options && attribute.options.length"
                    [id]="'attribute-' + attribute.id"
                    [ngModel]="getAttributeValue(attribute.id)"
                    (ngModelChange)="handleAttributeChange(attribute.id, $event, getAttributeDescription(attribute.id))"
                    [name]="'attribute-' + attribute.id"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    <option value="">-- Chọn {{ attribute.name }} --</option>
                    <option *ngFor="let option of attribute.options" [value]="option.id">
                      {{ option.value }}
                    </option>
                  </select>

                  <!-- Nếu không có options -->
                  <input 
                    *ngIf="!attribute.options || !attribute.options.length"
                    type="text"
                    [id]="'attribute-' + attribute.id"
                    [ngModel]="getAttributeValue(attribute.id)"
                    (ngModelChange)="handleAttributeChange(attribute.id, $event, getAttributeDescription(attribute.id))"
                    [name]="'attribute-' + attribute.id"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    [placeholder]="'Nhập ' + attribute.name"
                  />
                </div>

                <button 
                  *ngIf="!isDefaultAttribute(attribute.id)"
                  type="button"
                  (click)="handleRemoveAttribute(attribute.id)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 self-end mb-1"
                >
                  Xóa
                </button>
              </div>

              <!-- Description Field -->
              <div>
                <label 
                  [attr.for]="'description-' + attribute.id"
                  class="block text-sm font-medium text-gray-500 mb-1"
                >
                  Mô tả chi tiết
                </label>
                <input 
                  type="text"
                  [id]="'description-' + attribute.id"
                  [ngModel]="getAttributeDescription(attribute.id)"
                  (ngModelChange)="handleAttributeChange(attribute.id, getAttributeValue(attribute.id), $event)"
                  [name]="'description-' + attribute.id"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  [placeholder]="getPlaceholderText(attribute)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Add Attribute Dropdown -->
        <div *ngIf="getAvailableAttributes().length > 0" class="flex gap-2 mb-6">
          <select 
            [(ngModel)]="selectedAttributeId"
            name="newAttribute"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="">-- Chọn thuộc tính --</option>
            <option *ngFor="let attr of getAvailableAttributes()" [value]="attr.id">
              {{ attr.name }}
            </option>
          </select>
          <button 
            type="button"
            (click)="handleAddAttribute()"
            [disabled]="!selectedAttributeId"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Thêm
          </button>
        </div>

        <!-- Submit Button -->
        <div class="pt-5">
          <button
            type="submit"
            class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Lưu sản phẩm
          </button>
        </div>
      </ng-container>
    </form>
  `,
  styleUrl: './dynamic-product.component.css'
})
export class DynamicProductComponent implements OnInit {
  categories: CategoryType[] = [];
  currentAttributes: AttributeType[] = [];
  categoryId: string = '';
  attributes: ProductAttributeValue[] = [];
  selectedAttributeId: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Lấy danh sách danh mục từ API
    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Khi category thay đổi
  onCategoryChange(categoryId: string) {
    this.categoryId = categoryId;
    if (!categoryId) {
      this.attributes = [];
      this.currentAttributes = [];
      return;
    }

    // Lấy danh sách thuộc tính cho danh mục được chọn
    this.dataService.getAttributes(categoryId).subscribe(attributes => {
      // Với mỗi thuộc tính, nếu có options cần gọi API để lấy giá trị
      const observables = attributes.map(attr =>
        this.dataService.getAttributeValues(attr.id).pipe(
          map(options => {
            // Nếu có options thì cập nhật vào thuộc tính
            if (options && options.length > 0) {
              attr.options = options;
            }
            return attr;
          })
        )
      );
      // Sử dụng forkJoin để xử lý tất cả các API giá trị đồng thời
      forkJoin(observables).subscribe(fullAttributes => {
        this.currentAttributes = fullAttributes;
        // Khởi tạo giá trị nhập cho mỗi thuộc tính
        this.attributes = fullAttributes.map(attr => ({
          attributeId: attr.id,
          value: '', // Sẽ là ID của attribute_value khi chọn
          description: ''
        }));
      });
    });
  }

  // Utility methods
  getAttributeValue(attributeId: string): string {
    return this.attributes.find(attr => attr.attributeId === attributeId)?.value || '';
  }

  getAttributeDescription(attributeId: string): string {
    return this.attributes.find(attr => attr.attributeId === attributeId)?.description || '';
  }

  isDefaultAttribute(attributeId: string): boolean {
    // Giả sử các thuộc tính mặc định là những thuộc tính có sẵn khi load category
    return this.currentAttributes.some(attr => attr.id === attributeId);
  }

  getPlaceholderText(attribute: AttributeType): string {
    return attribute.name === 'RAM'
      ? 'VD: 32GB DDR5, hỗ trợ nâng cấp'
      : `Thông tin chi tiết về ${attribute.name}`;
  }

  // Khi thuộc tính thay đổi, cập nhật giá trị và mô tả
  handleAttributeChange(attributeId: string, value: string, description: string) {
    const index = this.attributes.findIndex(attr => attr.attributeId === attributeId);
    if (index >= 0) {
      this.attributes[index] = { attributeId, value, description };
    } else {
      this.attributes.push({ attributeId, value, description });
    }
  }

  // Thêm thuộc tính mới
  handleAddAttribute() {
    if (!this.selectedAttributeId) return;
    // Tìm thuộc tính trong danh sách toàn bộ (bạn có thể gọi API /api/attributes nếu cần)
    const attrToAdd = this.currentAttributes.find(attr => attr.id === this.selectedAttributeId);
    if (!attrToAdd) return;
    this.currentAttributes.push(attrToAdd);
    this.attributes.push({ attributeId: this.selectedAttributeId, value: '', description: '' });
    this.selectedAttributeId = '';
  }

  // Xóa thuộc tính
  handleRemoveAttribute(attributeId: string) {
    this.currentAttributes = this.currentAttributes.filter(attr => attr.id !== attributeId);
    this.attributes = this.attributes.filter(attr => attr.attributeId !== attributeId);
  }

  // Lấy các thuộc tính có thể thêm (không trùng với những thuộc tính hiện tại)
  getAvailableAttributes(): AttributeType[] {
    // Ở đây nếu cần, bạn có thể gọi API /api/attributes để lấy toàn bộ thuộc tính
    // Giả sử currentAttributes là các thuộc tính đang có
    return [];
  }

  // Xử lý submit form
  handleSubmit() {
    console.log({
      categoryId: this.categoryId,
      attributes: this.attributes
    });
    return JSON.stringify({ categoryId: this.categoryId, attributes: this.attributes }, null, 2)
  }
}