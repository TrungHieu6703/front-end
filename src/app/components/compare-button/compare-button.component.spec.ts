import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareButtonComponent } from './compare-button.component';

describe('CompareButtonComponent', () => {
  let component: CompareButtonComponent;
  let fixture: ComponentFixture<CompareButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
