import { Component } from '@angular/core';
import { RoleComponent } from "../role/role.component";
import { DesignationComponent } from "../designation/designation.component";
import { CommonModule } from '@angular/common';
import { DynamicProductComponent } from "../dynamic-product/dynamic-product.component";

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [RoleComponent, DesignationComponent, CommonModule, DynamicProductComponent],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css'
})
export class MasterComponent {
  isUpdate:boolean = true; 
  productId: string = '36bc21fe-078d-49b7-8029-dac711ad5905'; 

  field: String = '';

  changeTab(tabName: String) {
    this.field = tabName;
  }
}
