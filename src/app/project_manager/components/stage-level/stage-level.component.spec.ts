import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageLevelComponent } from './stage-level.component';

describe('StageLevelComponent', () => {
  let component: StageLevelComponent;
  let fixture: ComponentFixture<StageLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StageLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StageLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
