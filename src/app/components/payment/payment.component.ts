import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TestService } from '../../services/test.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { HeaderComponent } from '../header/header.component';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router'; // Thêm import Router và ActivatedRoute
import { MessageService } from 'primeng/api'; // Import MessageService để hiển thị toast
import { ToastModule } from 'primeng/toast'; // Import ToastModule
import { NgZone } from '@angular/core';
interface CartItem {
  id: string;
  name: string;
  avatar: string;
  price: number;
  quantity?: number;
}

interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CardModule, 
    RadioButtonModule, 
    FormsModule, 
    InputTextModule, 
    CommonModule, 
    HeaderComponent,
    ToastModule // Thêm ToastModule vào imports
  ],
  providers: [MessageService], // Thêm MessageService vào providers
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  gender: string = '';
  paymentMethod: string = '';

  fullName: string = 'Đỗ Trung Hiếu';
  phoneNumber: string = '0123456789';
  province: string = 'Bắc Ninh';
  district: string = 'Thuận Thành';
  ward: string = 'Hồ';
  street: string = 'Xóm Ngõ Ngo, thôn Lạc Thổ Bắc';
  addressType: string = 'Home';
  note: string = '';

  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  discountAmount: number = 0;
  shippingFee: string = 'Liên hệ';
  promoCode: string = '';

  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];

  selectedProvince: string = '';
  selectedDistrict: string = '';
  selectedWard: string = '';

  isAvailable?: boolean;
  
  constructor(
    private testService: TestService, 
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router, // Thêm Router
    private route: ActivatedRoute, // Thêm ActivatedRoute
    private messageService: MessageService // Thêm MessageService
  ) { }

  ngOnInit() {
    this.loadCartItems();
    this.loadProvinces();
    
    // Kiểm tra callback từ VNPay
    this.checkPaymentStatus();
  }

  // Thêm hàm kiểm tra trạng thái thanh toán từ URL
  checkPaymentStatus() {
    this.route.queryParams.subscribe(params => {
      if (params['payment']) {
        if (params['payment'] === 'success') {
          // Hiển thị thông báo thành công
          alert("Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận!")
          // Xóa toàn bộ giỏ hàng
          this.clearCart();
          
          // Chuyển hướng về trang chủ sau 2 giây
          setTimeout(() => {
            this.router.navigate(['/designation']);
          }, 2000);
          
        } else if (params['payment'] === 'failed') {
          // Hiển thị thông báo thất bại
          alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.")
        }
      }
    });
  }

  // Thêm hàm xóa toàn bộ giỏ hàng
  clearCart() {
    // Xóa giỏ hàng trong component
    this.cartItems = [];
    this.calculateTotalAmount();
    
    // Xóa giỏ hàng trong service
    this.cartService.clearCart();
  }

  loadCartItems() {
    this.testService.getPosts().subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.cartItems = response.map(item => ({ ...item, quantity: 1 }));
          this.calculateTotalAmount();
        } else {
          console.error('API trả về không đúng định dạng:', response);
        }
      },
      error: (err) => console.error('Lỗi khi lấy dữ liệu giỏ hàng:', err),
    });
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  }

  updateQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;

    this.testService.checkQuantity(item.id, newQuantity).subscribe(
      (isAvailable) => {
        if (isAvailable) {
          item.quantity = newQuantity;
          this.calculateTotalAmount();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Không đủ hàng',
            detail: 'Số lượng sản phẩm trong kho không đủ.'
          });
        }
      },
      (error) => {
        console.log(this.isAvailable)
        console.error('Lỗi khi kiểm tra số lượng:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Đã xảy ra lỗi khi kiểm tra số lượng tồn kho.'
        });
      }
    );
  }

  removeItem(index: number) {
    // Lấy ID sản phẩm cần xóa từ cartItems
    const productId = this.cartItems[index].id;
    
    // Xóa sản phẩm khỏi mảng cartItems trong component
    this.cartItems.splice(index, 1);
    
    // Cập nhật tổng tiền
    this.calculateTotalAmount();
    
    // Xóa sản phẩm khỏi CartService (giỏ hàng lưu trong cookie)
    const currentCart = this.cartService.getCart();
    const updatedCart = currentCart.filter(id => id !== productId);
    
    // Tạo một đối tượng giả để gọi toggleCart (hoặc tạo phương thức riêng trong CartService)
    const fakeProduct = { id: productId, name: '', image: '', price: '', is_compare: false };
    this.cartService.toggleCart(fakeProduct);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Đã xóa sản phẩm',
      detail: 'Sản phẩm đã được xóa khỏi giỏ hàng'
    });
  }

  // applyPromoCode() {
  //   this.discountAmount = this.totalAmount * 0.05;
  //   this.calculateTotalAmount();
    
  //   this.messageService.add({
  //     severity: 'success',
  //     summary: 'Áp dụng mã giảm giá',
  //     detail: 'Mã giảm giá đã được áp dụng thành công!'
  //   });
  // }

  async loadProvinces() {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/');
      const data = await res.json();
      this.provinces = data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải danh sách tỉnh/thành phố'
      });
    }
  }

  async loadDistricts() {
    if (this.selectedProvince) {
      console.log(this.selectedProvince)
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${this.selectedProvince}?depth=2`);
        const data = await res.json();
        if (data.districts && data.districts.length > 0) {
          this.districts = data.districts;
          this.province = data.name;
          this.selectedDistrict = '';
          this.district = '';
          this.selectedWard = '';
          this.ward = '';
        } else {
          this.districts = [];
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin quận/huyện:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách quận/huyện'
        });
      }
    }
  }

  async loadWards() {
    if (this.selectedDistrict) {
      console.log(this.selectedDistrict)
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${this.selectedDistrict}?depth=2`);
        const data = await res.json();
        if (data.wards && data.wards.length > 0) {
          this.wards = data.wards;
          this.district = data.name;
          this.selectedWard = '';
          this.ward = '';
        } else {
          this.wards = [];
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phường/xã:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách phường/xã'
        });
      }
    }
  }

  onWardChange(): void {
    if (this.selectedWard) {
      const selectedWardObj = this.wards.find(w => String(w.code) === this.selectedWard);
      if (selectedWardObj) {
        this.ward = selectedWardObj.name;
      }
    }
  }

  // combineAddress(): void {
  //   const address = {
  //     province: this.province,
  //     district: this.district,
  //     ward: this.ward,
  //     street: this.street
  //   };

  //   console.log('Địa chỉ đầy đủ:', address);
  //   this.messageService.add({
  //     severity: 'info',
  //     summary: 'Địa chỉ',
  //     detail: `${this.street}, ${this.ward}, ${this.district}, ${this.province}`
  //   });
  // }

  placeOrder() {
    let shippingInfo = 
   `Họ tên: ${this.fullName}
    SĐT: ${this.phoneNumber}
    Giới tính: ${this.gender}
    Địa chỉ: ${this.street}, ${this.ward}, ${this.district}, ${this.province}
    Loại địa chỉ: ${this.addressType}
    Ghi chú: ${this.note}
    Phương thức thanh toán: ${this.paymentMethod}`;

    console.log('ShippingInfo (formatted):', shippingInfo);

    let orderItems = this.cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    console.log('OrderItems:', orderItems);

    let payload = {
      user_id: 'f45ab574-caec-4e21-8868-c79e78dde294', // Giả sử có ID người dùng, thực tế lấy từ auth service
      status: 'PENDING',
      total: this.totalAmount - this.discountAmount,
      payment_method: this.paymentMethod,
      shippingInfo: shippingInfo,
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity || 1,
        price: item.price
      }))
    };

    // Kiểm tra giỏ hàng
    if (this.cartItems.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giỏ hàng trống',
        detail: 'Vui lòng thêm sản phẩm vào giỏ hàng'
      });
      return;
    }

    if (!this.paymentMethod) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng chọn phương thức thanh toán'
      });
      return;
    }

    // Validate địa chỉ
    if (!this.street || !this.ward || !this.district || !this.province) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng điền đầy đủ thông tin địa chỉ'
      });
      return;
    }

    console.log('Payload đặt hàng:', JSON.stringify(payload, null, 2));

    // Gọi API thông qua service (demo)
    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        console.log('Đơn hàng được tạo:', res);
        
        // Xử lý theo phương thức thanh toán
        if (this.paymentMethod === 'VNPay') {
          // Nếu chọn VNPay, gọi API để lấy URL thanh toán
          const totalPrice = this.totalAmount - this.discountAmount;
          const orderId = res.data.id; // Giả sử API trả về đơn hàng với ID
          console.log(orderId)
          console.log(res)
          this.orderService.getVnPayUrl(totalPrice, orderId).subscribe({
            next: (paymentUrl) => {
              console.log('URL thanh toán VNPay:', paymentUrl);
              // Chuyển hướng đến trang thanh toán VNPay
              window.location.href = paymentUrl;
            },
            error: (err) => {
              console.error('Lỗi khi lấy URL thanh toán VNPay:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Có lỗi xảy ra khi khởi tạo thanh toán VNPay, vui lòng thử lại sau.'
              });
            }
          });
        } else if (this.paymentMethod === 'COD') {
          // Nếu chọn COD, hiển thị thông báo thành công
          this.messageService.add({
            severity: 'success',
            summary: 'Đặt hàng thành công',
            detail: 'Cảm ơn bạn đã mua hàng!'
          });
          
          // Xóa giỏ hàng sau khi đặt hàng thành công
          this.clearCart();
          
          // Chuyển hướng đến trang xác nhận hoặc trang chủ sau 2 giây
          setTimeout(() => {
            this.router.navigate(['/designation']);
          }, 4000);
        }
      },
      error: (err) => {
        console.error('Lỗi khi tạo đơn hàng:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Có lỗi xảy ra khi đặt hàng, vui lòng thử lại sau.'
        });
      }
    });
  }  
}