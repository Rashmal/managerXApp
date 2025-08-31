import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripePaymentLogComponent } from './stripe-payment-log.component';

describe('StripePaymentLogComponent', () => {
  let component: StripePaymentLogComponent;
  let fixture: ComponentFixture<StripePaymentLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StripePaymentLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StripePaymentLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
