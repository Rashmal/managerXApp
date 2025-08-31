import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorSettingsComponent } from './contractor-settings.component';

describe('ContractorSettingsComponent', () => {
  let component: ContractorSettingsComponent;
  let fixture: ComponentFixture<ContractorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractorSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
