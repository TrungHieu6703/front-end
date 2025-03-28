import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { DataService, CategoryType, AttributeType, AttributeValue, ProductAttributeValue } from '../../services/data.service'
@Component({
  selector: 'app-dynamic-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-product.component.html',
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
    const result = this.attributes
      .filter(attr => attr.value.trim() !== '') // Lọc bỏ những giá trị rỗng
      .map(attr => ({
        attributeValueId: attr.value, // Sử dụng giá trị đã chọn làm attributeValueId
        value: attr.description // Giữ phần mô tả nếu cần
      }));
  
    return JSON.stringify(result, null, 2);
  }
  
  
  
  
}