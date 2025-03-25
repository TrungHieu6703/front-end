import { Component, OnInit } from '@angular/core';
import { HomeDataService } from '../../services/home-data.service';
import { HomeData } from '../../interface/home-data';
@Component({
  selector: 'app-home-data',
  standalone: true,
  imports: [],
  providers: [HomeDataService],
  templateUrl: './home-data.component.html',
  styleUrl: './home-data.component.css'
})
export class HomeDataComponent implements OnInit {

  data: HomeData | null = null; 

  ngOnInit() {
    // this.loadData();
  }



  constructor(
    private homeService: HomeDataService,
  ) {}

  loadData() {
    this.homeService.getPosts().subscribe({
      next: (response) => {
        if (response) {
          this.data = response;
          console.log('Dữ liệu API:', this.data);
        } else {
          console.log(response)
          console.error('API trả về không đúng định dạng:', response);
          this.data = null;
        }
      },
      error: (err) => console.error('Lỗi khi lấy data:', err),
    });
  }
}
