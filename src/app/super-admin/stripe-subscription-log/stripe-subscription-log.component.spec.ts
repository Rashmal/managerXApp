import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeSubscriptionLogComponent } from './stripe-subscription-log.component';

describe('StripeSubscriptionLogComponent', () => {
  let component: StripeSubscriptionLogComponent;
  let fixture: ComponentFixture<StripeSubscriptionLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StripeSubscriptionLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StripeSubscriptionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
