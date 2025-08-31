import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorContactsComponent } from './contractor-contacts.component';

describe('ContractorContactsComponent', () => {
  let component: ContractorContactsComponent;
  let fixture: ComponentFixture<ContractorContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractorContactsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
