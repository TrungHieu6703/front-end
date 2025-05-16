import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent {
  brands = [
    { name: 'Dell', imageUrl: 'assets/images/brand/brand-dell-logo.png', link: '#' },
    { name: 'HP', imageUrl: 'assets/images/brand/hp-logo.png', link: '#' },
    { name: 'Lenovo', imageUrl: 'assets/images/brand/Lenovo_logo.png', link: '#' },
    { name: 'Asus', imageUrl: 'assets/images/brand/asus-logo.webp', link: '#' },
    { name: 'Acer', imageUrl: 'assets/images/brand/acer-logo.png', link: '#' },
    { name: 'MSI', imageUrl: 'assets/images/brand/msi-logo.png', link: '#' },
    { name: 'Microsoft', imageUrl: 'assets/images/brand/microsoft-logo.png', link: '#' },
    { name: 'LG', imageUrl: 'assets/images/brand/lg-logo.webp', link: '#' },
    { name: 'Apple', imageUrl: 'assets/images/brand/apple-logo.webp', link: '#' },
    { name: 'ThinkPad', imageUrl: 'assets/images/brand/thinkpad-logo.png', link: '#' }
  ];
}