import { Component, OnInit, Input } from '@angular/core';
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
  @Input() isUpdate: boolean = false;
  @Input() productId: string = '';

  categories: CategoryType[] = [];
  currentAttributes: AttributeType[] = [];
  categoryId: string = '';
  attributes: ProductAttributeValue[] = [];
  selectedAttributeId: string = '';
  productCategoryId: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Lấy danh sách danh mục từ API
    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
      
      // Nếu đang ở chế độ update và có productId
      if (this.isUpdate && this.productId) {
        this.loadProductAttributes();
      }
    });
  }

  // Tải thông tin sản phẩm nếu đang ở chế độ update
  loadProductAttributes() {
    this.dataService.getProductAttributeValues(this.productId).subscribe(productAttributes => {
      if (productAttributes && productAttributes.length > 0) {
        console.log('Product attributes loaded:', productAttributes);
        
        // Lấy category từ sản phẩm (giả sử category được lưu ở một field khác)
        // Trong trường hợp thực tế bạn cần gọi API để lấy categoryId của product
        this.dataService.getProductCategory(this.productId).subscribe(category => {
          this.productCategoryId = category.id;
          // Tự động chọn category
          this.categoryId = this.productCategoryId;
          this.onCategoryChange(this.categoryId);
          
          // Sau khi attributes đã được tải, cập nhật giá trị
          setTimeout(() => {
            this.updateAttributesFromProductData(productAttributes);
          }, 500);
        });
      }
    });
  }

  // Cập nhật giá trị các thuộc tính từ dữ liệu của sản phẩm
  updateAttributesFromProductData(productAttributes: any[]) {
    productAttributes.forEach(attr => {
      const index = this.attributes.findIndex(a => a.attributeId === attr.id);
      
      if (index >= 0) {
        // Đảm bảo lấy đúng giá trị description từ cấu trúc JSON
        this.attributes[index] = {
          attributeId: attr.id,
          value: attr.id_select || '',
          description: attr.description || '' // Đây là giá trị "Mô tả cho RAM" từ JSON của bạn
        };
      }
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
        
        // Nếu đang update và đã có dữ liệu sản phẩm, tải lại dữ liệu
        if (this.isUpdate && this.productId) {
          this.dataService.getProductAttributeValues(this.productId).subscribe(productAttributes => {
            this.updateAttributesFromProductData(productAttributes);
          });
        }
      });
    });
  }

  // Utility methods
  getAttributeValue(attributeId: string): string {
    const attribute = this.attributes.find(attr => attr.attributeId === attributeId);
    return attribute?.value || '';
  }

  getAttributeDescription(attributeId: string): string {
    const attribute = this.attributes.find(attr => attr.attributeId === attributeId);
    return attribute?.description || '';
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

  // Xử lý submit form
  handleSubmit() {
    const result = this.attributes
      .filter(attr => attr.value.trim() !== '') // Lọc bỏ những giá trị rỗng
      .map(attr => ({
        attributeValueId: attr.value, // Sử dụng giá trị đã chọn làm attributeValueId
        value: attr.description // Giữ phần mô tả nếu cần
      }));
    console.log(result);
     
    return JSON.stringify(result, null, 2);
  }
}