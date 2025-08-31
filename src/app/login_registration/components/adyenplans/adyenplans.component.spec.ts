import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdyenplansComponent } from './adyenplans.component';

describe('AdyenplansComponent', () => {
  let component: AdyenplansComponent;
  let fixture: ComponentFixture<AdyenplansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdyenplansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdyenplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
