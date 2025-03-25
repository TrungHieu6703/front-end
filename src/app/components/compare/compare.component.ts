import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent {
  @Input() listCompare!: ({ image: string; name: string } | null)[];

  @Input() badge_favourite?: number;

  removeItem(i: any){
    this.listCompare[i] = null
  }
}
