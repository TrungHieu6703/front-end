import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {
  slides = [
    {
      imageUrl: 'assets/images/banner/banneri-thinkbook-x-ai.webp',
      title: 'Laptop Chất - Giá Tốt',
      description: 'Khuyến mãi đặc biệt - Giảm đến 30% cho laptop gaming cao cấp',
      buttonText: 'Xem ngay',
      buttonLink: '#'
    },
    {
      imageUrl: 'assets/images/banner/banner--thinkbook.webp', // Thay bằng path thực tế của bạn
      title: 'Gaming Mạnh Mẽ',
      description: 'Trải nghiệm chơi game đỉnh cao với dòng laptop gaming hiệu năng cao',
      buttonText: 'Khám phá',
      buttonLink: '#'
    },
    {
      imageUrl: 'assets/images/banner/banner-ideapad.webp', // Thay bằng path thực tế của bạn
      title: 'Phụ Kiện Chính Hãng',
      description: 'Bộ sưu tập phụ kiện laptop đa dạng với bảo hành chính hãng',
      buttonText: 'Mua ngay',
      buttonLink: '#'
    }
  ];

  currentSlide = 0;
  slideInterval: any;

  constructor() { }

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  showSlide(index: number): void {
    this.currentSlide = index;
    this.resetTimer();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  resetTimer(): void {
    this.stopSlideshow();
    this.startSlideshow();
  }

  onMouseEnter(): void {
    this.stopSlideshow();
  }

  onMouseLeave(): void {
    this.startSlideshow();
  }
}