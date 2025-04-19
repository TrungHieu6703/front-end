import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListProduct } from '../../../interface/list-product';
import { ListProductService } from '../../../services/list-product.service';
import { Table } from 'primeng/table';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [ImportsModule, RouterModule],
  providers: [MessageService, ConfirmationService, ListProductService],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined;

  listproductDialog: boolean = false;
  listproducts: ListProduct[] = [];
  listproduct: ListProduct = {};
  selectedListProducts: ListProduct[] | null = null;
  submitted: boolean = false;

  constructor(
    private listProductService: ListProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit() {
    this.loadListProducts();
  }

  loadListProducts() {
    this.listProductService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.listproducts = response; // Lấy đúng mảng `data`
          console.log(this.listproducts)
        } else {
          console.error('API trả về không đúng định dạng:', response);
          this.listproducts = [];
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu thuộc tính:', err),
    });
  }
  

  openNew() {
    this.listproduct = {};
    this.submitted = false;
    this.listproductDialog = true;
  }

  deleteSelectedListProducts() {
    if (!this.selectedListProducts || this.selectedListProducts.length === 0) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các thuộc tính đã chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let deleteCount = 0;
        this.selectedListProducts!.forEach((attr) => {
          if (attr.id) {
            this.listProductService.deletePost(attr.id).subscribe({
              next: () => {
                deleteCount++;
                if (deleteCount === this.selectedListProducts!.length) {
                  this.loadListProducts(); // Load lại danh sách khi xóa xong
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã xóa các thuộc tính đã chọn',
                    life: 3000,
                  });
                  this.selectedListProducts = null;
                }
              },
              error: (err) => console.error(`Lỗi khi xóa ${attr.name}:`, err),
            });
          }
        });
      },
    });
  }

  editListProduct(listproduct: ListProduct) {
    console.log('click')
    this.router.navigate(['update-product'], {state: { product: listproduct}})
    this.listproductDialog = true;
  }

  deleteListProduct(listproduct: ListProduct) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${listproduct.name}"?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (listproduct.id) {
          console.log(listproduct.id)
          this.listProductService.deletePost(listproduct.id).subscribe({
            next: () => {
              this.loadListProducts(); // Load lại danh sách sau khi xóa
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
    this.listproductDialog = false;
    this.submitted = false;
  }

  // saveListProduct() {
  //   this.submitted = true;

  //   if (this.listproduct.name?.trim()) {
  //     if (this.listproduct.id) {
  //       this.listProductService.update(this.listproduct.id, this.listproduct).subscribe({
  //         next: () => {
  //           this.loadListProducts();
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Thành công',
  //             detail: 'Đã cập nhật thuộc tính',
  //             life: 3000,
  //           });
  //         },
  //         error: (err) => console.error('Lỗi khi cập nhật:', err),
  //       });
  //     } else {
  //       this.listProductService.create(this.listproduct).subscribe({
  //         next: (id) => {
  //           this.listproduct.id = id;
  //           this.loadListProducts();
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Thành công',
  //             detail: 'Đã thêm thuộc tính',
  //             life: 3000,
  //           });
  //         },
  //         error: (err) => console.error('Lỗi khi tạo thuộc tính:', err),
  //       });
  //     }

  //     this.listproductDialog = false;
  //     this.listproduct = {};
  //   }
  // }
}

