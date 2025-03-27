import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-compare-button',
  standalone: true,
  imports: [],
  templateUrl: './compare-button.component.html',
  styleUrl: './compare-button.component.css'
})
export class CompareButtonComponent {
  isVisibleCompare = false;
  isVisibleCompareLess = true;

  constructor (private sharedService: SharedService) {
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompare = state));
    this.sharedService.CompareBtnState$.subscribe((state) => (this.isVisibleCompareLess = state));
  }

  btnCompare(){
    this.sharedService.toggleCompareStateVisibility()
    this.sharedService.toggleCompareBtnStateVisibility()
  }


}
