import { Component, HostListener, ElementRef, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-introduce',
  templateUrl: './introduce.component.html',
  styleUrls: ['./introduce.component.css'],
  standalone: true,
  imports: [HeaderComponent]
})
export class IntroduceComponent implements AfterViewInit {

  // Use ViewChildren to get references to the elements
  @ViewChildren('missionItem') missionItems!: QueryList<ElementRef>;
  @ViewChildren('valueItem') valueItems!: QueryList<ElementRef>;

  constructor() { }

  ngAfterViewInit() {
    // Initial check in case elements are already in view
    this.checkElementsVisibility();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkElementsVisibility();
  }

  private checkElementsVisibility() {
    const distance = 50; // Adjust as needed

    this.missionItems.forEach(item => {
      this.fadeIn(item.nativeElement, distance);
    });

    this.valueItems.forEach(item => {
      this.fadeIn(item.nativeElement, distance);
    });
  }

  private fadeIn(element: HTMLElement, triggerDistance: number) {
    if (element) {
      const position = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (position < windowHeight - triggerDistance) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        // Optional: Add a class for CSS transitions instead of direct style manipulation
        // element.classList.add('is-visible');
      }
    }
  }
}