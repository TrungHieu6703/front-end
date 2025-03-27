import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Product {
    name: string;
    image: string;
    price: string;
    is_compare: boolean;
  }

@Injectable({
  providedIn: 'root'
})
export class SharedService  {
    private CompareState = new BehaviorSubject<boolean>(false);
    CompareState$ = this.CompareState.asObservable();
  
    toggleCompareStateVisibility() {
        console.log('>>>>>>>>')
      this.CompareState.next(!this.CompareState.value);
    }

    private CompareBtnState = new BehaviorSubject<boolean>(true);
    CompareBtnState$ = this.CompareBtnState.asObservable();

    toggleCompareBtnStateVisibility() {
        console.log('>>>>>>>>')
      this.CompareBtnState.next(!this.CompareBtnState.value);
    }
}
