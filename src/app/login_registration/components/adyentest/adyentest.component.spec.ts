import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdyentestComponent } from './adyentest.component';

describe('AdyentestComponent', () => {
  let component: AdyentestComponent;
  let fixture: ComponentFixture<AdyentestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdyentestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdyentestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
