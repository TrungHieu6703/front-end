import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/config';
interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
  selector: 'app-role',
  standalone: true,
  imports: [FormsModule,RouterOutlet, ButtonModule,
FileUploadModule, ToastModule, CommonModule
   ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
  providers: [MessageService]
})


export class RoleComponent {
  name: String = "Hieu"

  private http = inject(HttpClient);

  option: String = ""

  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {}


  async onUpload(event:FileUploadHandlerEvent) {
    const formData = new FormData()

      for(let file of event.files) {
          formData.append("files1", file, file.name)
      }
      console.log(formData.getAll("files"))
      this.http.post<any>(API_URL + "products/upload-multiple", formData).subscribe(
        (response) => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Thêm sản phẩm thành công' }),
        
        (error) => console.error("Lỗi khi thêm sản phẩm:", error)
      );

    }

    show() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Thêm sản phẩm thành công' });
    }
}