import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorTasksComponent } from './contractor-tasks.component';

describe('ContractorTasksComponent', () => {
  let component: ContractorTasksComponent;
  let fixture: ComponentFixture<ContractorTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractorTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
