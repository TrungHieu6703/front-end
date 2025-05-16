import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TestService } from '../../services/test.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

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
  imports: [CardModule, RadioButtonModule, FormsModule, InputTextModule, CommonModule],
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
  constructor(private testService: TestService, private orderService: OrderService) { }

  ngOnInit() {
    this.loadCartItems();
    this.loadProvinces();
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
          alert('Số lượng sản phẩm trong kho không đủ.');
        }
      },
      (error) => {
        console.log(this.isAvailable)
        console.error('Lỗi khi kiểm tra số lượng:', error);
        alert('Đã xảy ra lỗi khi kiểm tra số lượng tồn kho.');
      }
    );
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.calculateTotalAmount();
  }

  applyPromoCode() {
    this.discountAmount = this.totalAmount * 0.05;
    this.calculateTotalAmount();
  }

  // ==============================
  // Phần địa chỉ dùng fetch() tránh lỗi CORS
  // ==============================

  async loadProvinces() {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/');
      const data = await res.json();
      this.provinces = data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
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

  combineAddress(): void {
    const address = {
      province: this.province,
      district: this.district,
      ward: this.ward,
      street: this.street
    };

    console.log('Địa chỉ đầy đủ:', address);
    alert(`Địa chỉ: ${this.street}, ${this.ward}, ${this.district}, ${this.province}`);
  }

  placeOrder() {
    let shippingInfo = `Họ tên: ${this.fullName}
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
    alert('Giỏ hàng đang trống');
    return;
  }

  if (!this.paymentMethod) {
    alert('Vui lòng chọn phương thức thanh toán');
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
              alert('Có lỗi xảy ra khi khởi tạo thanh toán VNPay, vui lòng thử lại sau.');
            }
          });
        } else if (this.paymentMethod === 'COD') {
          // Nếu chọn COD, hiển thị thông báo thành công
          alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
          // Chuyển hướng đến trang xác nhận hoặc trang chủ
          // window.location.href = '/confirmation';
        }
      },
      error: (err) => {
        console.error('Lỗi khi tạo đơn hàng:', err);
        alert('Có lỗi xảy ra khi đặt hàng, vui lòng thử lại sau.');
      }
    });
  }  
}
