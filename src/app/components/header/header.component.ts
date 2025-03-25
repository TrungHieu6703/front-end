import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  count_love : number = 0;
  count_card : number = 0;

  private http = inject(HttpClient); // Angular 15+ way to inject services
  brands: any[] = [];
  activeDropdown: string | null = null;
  ngOnInit() {
    this.fetchBrands();
  }

  fetchBrands() {
    this.http.get<any[]>('http://localhost:8080/brands/getAllBrandsWithProductLines')
      .subscribe({
        next: (data) => {
          this.brands = data;
          console.log('Fetched brands:', data);
        },
        error: (error) => console.error('Error fetching brands:', error)
      });
  }

  showDropdown(menu: string) {
    this.activeDropdown = menu;
  }

  hideDropdown() {
    this.activeDropdown = null;
  }
}
