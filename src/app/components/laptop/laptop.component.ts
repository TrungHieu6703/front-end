import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [NgFor, RouterLink],
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.scss']
})
export class LaptopComponent implements OnInit {
  categories: Category[] = [
    {
      id: 'office',
      title: 'Học tập, Văn phòng',
      imageUrl: 'assets/images/laptop/laptop-van-phong.webp',
      link: '/category/b20e6395-8c15-4e1b-b7a0-ea5cad93eb7f',
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
      link: '/category/bfe77e54-215f-4aa6-9fe9-83e7ae497d38',
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
      link: '/category/1abd41b2-12a5-4d1f-a47a-ab0f2622b656',
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
      link: '/category/51539613-bda1-4936-9e73-1ba329109510',
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
      link: '/category/7585dc25-0d2b-453e-8ac8-66853b3dc43c',
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