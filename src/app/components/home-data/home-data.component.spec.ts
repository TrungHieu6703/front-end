import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDataComponent } from './home-data.component';

describe('HomeDataComponent', () => {
  let component: HomeDataComponent;
  let fixture: ComponentFixture<HomeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
