import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorCalendarComponent } from './contractor-calendar.component';

describe('ContractorCalendarComponent', () => {
  let component: ContractorCalendarComponent;
  let fixture: ComponentFixture<ContractorCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractorCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
