import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { PhotoService } from './photo.service';
import { NgModel } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { EditorComponent } from '../editor/editor.component';
@Component({
  selector: 'app-first',
  standalone: true,
  imports: [ImportsModule, EditorComponent, HeaderComponent],
  providers: [PhotoService],
  templateUrl: './first.component.html',
  styleUrl: './first.component.css'
})
export class FirstComponent implements OnInit {
  images: any[] | undefined;
  data: string = `<h1 class="ql-align-center"><strong>Hello</strong></h1><h3 class="ql-align-justify"><strong style="color: rgb(17, 17, 17);">Ghi&nbsp;chú&nbsp;các&nbsp;cổng&nbsp;kết&nbsp;nối&nbsp;của&nbsp;Lenovo&nbsp;Ideapad&nbsp;Slim&nbsp;5&nbsp;2024&nbsp;(Lenovo&nbsp;Xiaoxin&nbsp;14&nbsp;AHP9):</strong></h3><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">1&nbsp;-&nbsp;Chân&nbsp;cắm&nbsp;sạc&nbsp;chân&nbsp;tròn</span></p><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">2&nbsp;-&nbsp;USB-A:&nbsp;truyền&nbsp;tải&nbsp;dữ&nbsp;liệu&nbsp;5Gbps</span></p><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">3&nbsp;-&nbsp;HDMI</span></p><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">4&nbsp;-&nbsp;USB-C&nbsp;(USB&nbsp;5Gbps),&nbsp;hỗ&nbsp;trợ&nbsp;tính&nbsp;năng&nbsp;PowerDelivery&nbsp;3.0&nbsp;&amp;&nbsp;DíplayPort&nbsp;1.2</span></p><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">5&nbsp;-&nbsp;Jack&nbsp;tai&nbsp;nghe</span></p><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">6&nbsp;-&nbsp;Nút&nbsp;nguồn</span></p><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">7&nbsp;-&nbsp;Khe&nbsp;đọc-ghi&nbsp;thẻ&nbsp;SD</span></p><p class="ql-align-justify"><span style="color: rgb(51, 51, 51);">8&nbsp;-&nbsp;USB-A:&nbsp;truyền&nbsp;tải&nbsp;dữ&nbsp;liệu&nbsp;5Gbps</span></p><p class="ql-align-center"></p>
`
  responsiveOptions: any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];

  constructor(private photoService: PhotoService) {}

  ngOnInit() {
      this.photoService.getImages().then((images) => {
          this.images = images;
      });
  }
}