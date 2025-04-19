import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeValueCrudComponent } from './attribute-value-crud.component';

describe('AttributeValueCrudComponent', () => {
  let component: AttributeValueCrudComponent;
  let fixture: ComponentFixture<AttributeValueCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeValueCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeValueCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
