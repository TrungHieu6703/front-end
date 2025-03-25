import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillViewComponent } from './quill-view.component';

describe('QuillViewComponent', () => {
  let component: QuillViewComponent;
  let fixture: ComponentFixture<QuillViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuillViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuillViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
