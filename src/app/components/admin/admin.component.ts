import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimengModule } from '../../primeng.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    // RouterLinkActive
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  sidebarVisible: boolean = false;

  menus = [
    {
      name: 'Product',
      link: 'product'
    },
    {
      name: "Brands",
      link: 'brands'
    },
    {
      name: "Categories",
      link: 'categories'
    },
    {
      name: "Coupon",
      link: '#'
    },
    {
      name: "Attribute",
      link: 'attributes'
    },
    {
      name: "AttributeValue",
      link: 'attribute-value'
    },
  ];

  logout(){
    console.log('logout')
  }
}
