import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAttributeManagerComponent } from './category-attribute-manager.component';

describe('CategoryAttributeManagerComponent', () => {
  let component: CategoryAttributeManagerComponent;
  let fixture: ComponentFixture<CategoryAttributeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAttributeManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAttributeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
