import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Import các module PrimeNG cần thiết
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Category {
  id: string;
  name: string;
}

interface Attribute {
  id: string;
  name: string;
}

interface AttributeSelectionItem extends Attribute {
  selected: boolean;
}

interface CategoryAttribute {
  categoryId: string;
  attributeId: string;
  visible: boolean;
  display: boolean;
  filter: boolean;
}

@Component({
  selector: 'app-category-attribute-manager',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,
    AccordionModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    MessageModule,
    MessagesModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './category-attribute-manager.component.html',
  styleUrls: ['./category-attribute-manager.component.css']
})
export class CategoryAttributeManagerComponent implements OnInit {
  categories: Category[] = [];
  attributes: Attribute[] = [];
  categoryAttributes: CategoryAttribute[] = [];
  selectedData: { [key: string]: { [key: string]: { visible: boolean, display: boolean, filter: boolean } } } = {};
  
  currentCategoryId: string | null = null;
  loading = false;
  displayAddDialog = false;
  availableAttributes: AttributeSelectionItem[] = [];
  selectAllChecked: boolean = false;
  activeIndex: number = 0;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAttributes();
    this.loadCategoryAttributes();
  }

  loadCategories(): void {
    this.http.get<any>('http://localhost:8080/categories').subscribe({
      next: (response) => {
        this.categories = response.data || [];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.showError('Không thể tải danh sách danh mục');
      }
    });
  }

  loadAttributes(): void {
    this.http.get<any>('http://localhost:8080/attributes').subscribe({
      next: (response) => {
        this.attributes = response.data || [];
      },
      error: (err) => {
        console.error('Error loading attributes:', err);
        this.showError('Không thể tải danh sách thuộc tính');
      }
    });
  }

  loadCategoryAttributes(): void {
    this.http.get<any>('http://localhost:8080/category-attributes').subscribe({
      next: (response) => {
        this.categoryAttributes = response.data || [];
        
        // Khởi tạo selectedData từ dữ liệu API
        this.initSelectedData();
      },
      error: (err) => {
        console.error('Error loading category attributes:', err);
        this.showError('Không thể tải cấu hình thuộc tính danh mục');
      }
    });
  }

  initSelectedData(): void {
    // Thiết lập cấu trúc dữ liệu ban đầu
    this.categories.forEach(category => {
      if (!this.selectedData[category.id]) {
        this.selectedData[category.id] = {};
      }
    });

    // Điền dữ liệu từ API
    this.categoryAttributes.forEach(ca => {
      if (!this.selectedData[ca.categoryId]) {
        this.selectedData[ca.categoryId] = {};
      }
      
      this.selectedData[ca.categoryId][ca.attributeId] = {
        visible: ca.visible,
        display: ca.display,
        filter: ca.filter
      };
    });
  }

  toggleCheckboxState(categoryId: string, attributeId: string, type: string): void {
    // Cập nhật giá trị
    const isChecked = this.selectedData[categoryId][attributeId][type as keyof { visible: boolean, display: boolean, filter: boolean }];
    
    // Nếu visible = false, vô hiệu hóa display và filter
    if (type === 'visible' && !isChecked) {
      this.selectedData[categoryId][attributeId].display = false;
      this.selectedData[categoryId][attributeId].filter = false;
    }
  }

  showAddAttributeModal(categoryId: string): void {
    this.currentCategoryId = categoryId;
    this.prepareAvailableAttributes(categoryId);
    this.selectAllChecked = false;
    this.displayAddDialog = true;
  }

  prepareAvailableAttributes(categoryId: string): void {
    // Lấy danh sách thuộc tính đã thêm vào danh mục
    const addedAttrIds = Object.keys(this.selectedData[categoryId] || {});
    
    // Lọc và tạo danh sách các thuộc tính có thể thêm với trạng thái selected = false
    this.availableAttributes = this.attributes
      .filter(attr => !addedAttrIds.includes(attr.id))
      .map(attr => ({
        ...attr,
        selected: false
      }));
  }

  toggleSelectAll(): void {
    // Áp dụng trạng thái selectAllChecked cho tất cả các thuộc tính
    this.availableAttributes.forEach(attr => {
      attr.selected = this.selectAllChecked;
    });
  }

  updateSelectAllState(): void {
    // Cập nhật trạng thái selectAllChecked dựa trên danh sách thuộc tính
    this.selectAllChecked = this.availableAttributes.length > 0 && 
                           this.availableAttributes.every(attr => attr.selected);
  }

  getAvailableAttributes(categoryId: string): Attribute[] {
    // Lấy danh sách thuộc tính đã thêm vào danh mục
    const addedAttrIds = Object.keys(this.selectedData[categoryId] || {});
    
    // Lọc danh sách thuộc tính chưa được thêm
    return this.attributes.filter(attr => !addedAttrIds.includes(attr.id));
  }

  getAttributeIds(categoryId: string): string[] {
    if (!this.selectedData[categoryId]) {
      return [];
    }
    return Object.keys(this.selectedData[categoryId]);
  }

  getAttributeName(attributeId: string): string {
    const attribute = this.attributes.find(attr => attr.id === attributeId);
    return attribute ? attribute.name : 'Unknown';
  }

  hasSelectedAttributes(): boolean {
    return this.availableAttributes.some(attr => attr.selected);
  }

  addSelectedAttributesToCategory(): void {
    if (this.currentCategoryId) {
      // Lọc ra các thuộc tính đã được chọn
      const selectedAttrs = this.availableAttributes.filter(attr => attr.selected);
      
      if (selectedAttrs.length > 0) {
        // Thêm các thuộc tính đã chọn
        if (!this.selectedData[this.currentCategoryId]) {
          this.selectedData[this.currentCategoryId] = {};
        }
        
        selectedAttrs.forEach(attr => {
          this.selectedData[this.currentCategoryId as string][attr.id] = { 
            visible: false, 
            display: false, 
            filter: false 
          };
        });
        
        // Đóng dialog
        this.displayAddDialog = false;
        this.currentCategoryId = null;
        
        this.showSuccess(`Đã thêm ${selectedAttrs.length} thuộc tính thành công`);
      }
    }
  }

  saveAllSelections(): void {
    this.loading = true;
    
    // Chuyển đổi cấu trúc dữ liệu để gửi lên API
    const dataToSave: CategoryAttribute[] = [];
    
    Object.keys(this.selectedData).forEach(categoryId => {
      Object.keys(this.selectedData[categoryId]).forEach(attributeId => {
        const data = this.selectedData[categoryId][attributeId];
        dataToSave.push({
          categoryId,
          attributeId,
          visible: data.visible,
          display: data.display,
          filter: data.filter
        });
      });
    });
    
    // Gửi dữ liệu lên API
    this.http.post('http://localhost:8080/category-attributes/batch', dataToSave).subscribe({
      next: (response) => {
        console.log('Saved successfully:', response);
        this.loading = false;
        this.showSuccess('Đã lưu cấu hình thành công');
      },
      error: (err) => {
        console.error('Error saving data:', err);
        this.loading = false;
        this.showError('Không thể lưu cấu hình thuộc tính danh mục');
      }
    });
  }

  removeAttribute(categoryId: string, attributeId: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa thuộc tính này khỏi danh mục?')) {
      delete this.selectedData[categoryId][attributeId];
      this.showSuccess('Đã xóa thuộc tính thành công');
    }
  }

  showSuccess(message: string) {
    this.messageService.add({severity:'success', summary: 'Thành công', detail: message});
  }

  showError(message: string) {
    this.messageService.add({severity:'error', summary: 'Lỗi', detail: message});
  }
}