import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdyenpaymentComponent } from './adyenpayment.component';

describe('AdyenpaymentComponent', () => {
  let component: AdyenpaymentComponent;
  let fixture: ComponentFixture<AdyenpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdyenpaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdyenpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
