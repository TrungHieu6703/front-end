import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicProductComponent } from './dynamic-product.component';

describe('DynamicProductComponent', () => {
  let component: DynamicProductComponent;
  let fixture: ComponentFixture<DynamicProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
