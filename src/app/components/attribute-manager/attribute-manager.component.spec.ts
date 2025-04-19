import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeManagerComponent } from './attribute-manager.component';

describe('AttributeManagerComponent', () => {
  let component: AttributeManagerComponent;
  let fixture: ComponentFixture<AttributeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
