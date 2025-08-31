import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorNotificationsComponent } from './contractor-notifications.component';

describe('ContractorNotificationsComponent', () => {
  let component: ContractorNotificationsComponent;
  let fixture: ComponentFixture<ContractorNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractorNotificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
