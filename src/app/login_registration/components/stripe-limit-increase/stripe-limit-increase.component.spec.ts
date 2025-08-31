import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeLimitIncreaseComponent } from './stripe-limit-increase.component';

describe('StripeLimitIncreaseComponent', () => {
  let component: StripeLimitIncreaseComponent;
  let fixture: ComponentFixture<StripeLimitIncreaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StripeLimitIncreaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StripeLimitIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
