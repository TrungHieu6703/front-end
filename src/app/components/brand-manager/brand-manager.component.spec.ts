import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandManagerComponent } from './brand-manager.component';

describe('BrandManagerComponent', () => {
  let component: BrandManagerComponent;
  let fixture: ComponentFixture<BrandManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
