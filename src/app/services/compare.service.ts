import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface CompareItem {
    image: string;
    name: string;
  }
@Injectable({
  providedIn: 'root'
})
export class CompareService {
    private listCompareSource = new BehaviorSubject<(CompareItem | null)[]>([null, null, null, null]);
  
    // Observable để các component có thể subscribe
    listCompare$ = this.listCompareSource.asObservable();
}