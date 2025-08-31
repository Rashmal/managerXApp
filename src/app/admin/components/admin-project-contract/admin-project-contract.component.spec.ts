import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectContractComponent } from './admin-project-contract.component';

describe('AdminProjectContractComponent', () => {
  let component: AdminProjectContractComponent;
  let fixture: ComponentFixture<AdminProjectContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProjectContractComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminProjectContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
