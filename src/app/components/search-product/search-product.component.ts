import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { NgIf, NgFor } from '@angular/common';
import { LaptopItemComponent } from '../laptop-item/laptop-item.component';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [ NgFor, LaptopItemComponent, TableModule, HeaderComponent, FooterComponent,
    CardModule,
    DataViewModule,],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.css'
})
export class SearchProductComponent implements OnInit {
  products: any[] = [];
  keyword: string = '';

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.keyword = params['keyword'];

      // 📌 Gọi API trực tiếp khi có keyword từ route param
      this.searchService.searchProductByKeyword(this.keyword)
        .subscribe(data => {
          this.products = data;
          console.log(this.products)
        });
    });
  }
}
