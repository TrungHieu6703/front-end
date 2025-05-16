import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Category {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  icons: string[];
}

@Component({
  selector: 'app-laptop',
  standalone: true,
  imports: [NgFor],
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.scss']
})
export class LaptopComponent implements OnInit {
  categories: Category[] = [
    {
      id: 'office',
      title: 'Học tập, Văn phòng',
      imageUrl: 'assets/images/laptop/laptop-van-phong.webp',
      link: 'https://trungtran.vn/laptop-van-phong/',
      icons: [
        'assets/images/laptop/word.jpg',
        'assets/images/laptop/ps.jpg',
        'assets/images/laptop/chorme.jpg'
      ]
    },
    {
      id: 'graphics',
      title: 'Đồ Họa, Kỹ thuật',
      imageUrl: 'assets/images/laptop/laptop-do-hoa-ki-thuat.webp',
      link: 'https://trungtran.vn/laptop-do-hoa/',
      icons: [
        'assets/images/laptop/pr.jpg',
        'assets/images/laptop/ae.jpg',
        'assets/images/laptop/siemens.jpg'
      ]
    },
    {
      id: 'programming',
      title: 'Lập trình',
      imageUrl: 'assets/images/laptop/laptop-lap-trinh.webp',
      link: 'https://trungtran.vn/laptop-chuyen-lap-trinh/',
      icons: [
        'assets/images/laptop/visual-studio.jpg',
        'assets/images/laptop/netbean.jpg',
        'assets/images/laptop/tag.jpg'
      ]
    },
    {
      id: 'gaming',
      title: 'Game',
      imageUrl: 'assets/images/laptop/laptop-gaming.webp',
      link: 'https://trungtran.vn/laptop-chuyen-game/',
      icons: [
        'assets/images/laptop/forza.jpg',
        'assets/images/laptop/witcher.jpg',
        'assets/images/laptop/pubg.jpg'
      ]
    },
    {
      id: 'premium',
      title: 'Siêu phẩm',
      imageUrl: 'assets/images/laptop/laptop-sieu-pham.webp',
      link: 'https://trungtran.vn/sieu-pham/',
      icons: [
        'assets/images/laptop/word.jpg',
        'assets/images/laptop/forza.jpg',
        'assets/images/laptop/ps.jpg'
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}