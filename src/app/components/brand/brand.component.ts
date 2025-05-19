import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent {
  brands = [
    { name: 'Dell', imageUrl: 'assets/images/brand/brand-dell-logo.png', link: '/brand/66664478-0283-11f0-8579-0242ac110002' },
    { name: 'HP', imageUrl: 'assets/images/brand/hp-logo.png', link: '/brand/6660626b-0283-11f0-8579-0242ac110002' },
    { name: 'Lenovo', imageUrl: 'assets/images/brand/Lenovo_logo.png', link: '/brand/66519312-0283-11f0-8579-0242ac110002' },
    { name: 'Asus', imageUrl: 'assets/images/brand/asus-logo.webp', link: '/brand/6659d35b-0283-11f0-8579-0242ac110002' },
    { name: 'Acer', imageUrl: 'assets/images/brand/acer-logo.png', link: '/brand/e4b1c5fe-7d74-479a-96a8-f80296c3ab20' },
    { name: 'MSI', imageUrl: 'assets/images/brand/msi-logo.png', link: '/brand/22fc59b5-0b63-4ef1-994c-de2e2151379d' },
    { name: 'Microsoft', imageUrl: 'assets/images/brand/microsoft-logo.png', link: '/brand/6681c51e-0283-11f0-8579-0242ac110002' },
    { name: 'LG', imageUrl: 'assets/images/brand/lg-logo.webp', link: '/brand/66664478-0283-11f0-8579-0242ac110002' },
    { name: 'Apple', imageUrl: 'assets/images/brand/apple-logo.webp', link: '/brand/664a7a9c-0283-11f0-8579-0242ac110002' },
    { name: 'ThinkPad', imageUrl: 'assets/images/brand/thinkpad-logo.png', link: '/brand/7bd16f77-479c-4c8f-8cd7-6e0d365bf821' }
  ];
}