import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripePlansComponent } from './stripe-plans.component';

describe('StripePlansComponent', () => {
  let component: StripePlansComponent;
  let fixture: ComponentFixture<StripePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StripePlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StripePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
