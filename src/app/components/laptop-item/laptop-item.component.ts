import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
@Component({
  selector: 'app-laptop-item',
  standalone: true,
  imports: [    
      FormsModule,
      CommonModule,
      RouterModule,
      TableModule,
      CardModule,
      DataViewModule,
      TagModule,
      RatingModule,
      ButtonModule,
      NgIf],
      providers: [WishlistService],
  templateUrl: './laptop-item.component.html',
  styleUrl: './laptop-item.component.css'
})
export class LaptopItemComponent {

  constructor(private wishlistService: WishlistService) {}



  @Input() product: any;
  @Input() isCompared: boolean = false;
  @Output() addToCompare = new EventEmitter<any>();
  @Output() loveEvent = new EventEmitter<any>();

  love() {
    this.wishlistService.addToWishlist(this.product);
  }

  addToListCompare() {
    this.addToCompare.emit(this.product);
    console.log(this.product)
  }
}
