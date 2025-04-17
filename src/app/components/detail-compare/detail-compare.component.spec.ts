import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCompareComponent } from './detail-compare.component';

describe('DetailCompareComponent', () => {
  let component: DetailCompareComponent;
  let fixture: ComponentFixture<DetailCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCompareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
