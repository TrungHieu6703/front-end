import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h3>Danh sách tỉnh/thành</h3>
    <ul>
      <li *ngFor="let province of provinces">{{ province.name }}</li>
    </ul>
  `
})
export class TestApiComponent implements OnInit {
  provinces: any[] = [];

  constructor() {}

  ngOnInit(): void {
    fetch('https://provinces.open-api.vn/api/p')
      .then(res => res.json())
      .then(data => {
        this.provinces = data;
      })
      .catch(error => console.error('Fetch error:', error));
  }
}
