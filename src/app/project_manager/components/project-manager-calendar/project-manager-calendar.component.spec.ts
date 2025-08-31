import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerCalendarComponent } from './project-manager-calendar.component';

describe('ProjectManagerCalendarComponent', () => {
  let component: ProjectManagerCalendarComponent;
  let fixture: ComponentFixture<ProjectManagerCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectManagerCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectManagerCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
