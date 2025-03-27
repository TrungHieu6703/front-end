import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { DynamicProductComponent } from '../dynamic-product/dynamic-product.component';
@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [NgFor,NgIf, DynamicProductComponent],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent {
  isVisibleCompare = false;
  isVisibleCompareLess = true;


  constructor (private sharedService: SharedService) {
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompare = state));
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompareLess = state));
  }

  btnCompareLess(){
    this.sharedService.toggleCompareStateVisibility()
    this.sharedService.toggleCompareBtnStateVisibility()
  }

  @Input() listCompare!: ({ image: string; name: string } | null)[];

  @Input() badge_favourite?: number;

  removeItem(i: any){
    this.listCompare[i] = null
  }
}
