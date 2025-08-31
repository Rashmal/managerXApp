import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerChecklistComponent } from './project-manager-checklist.component';

describe('ProjectManagerChecklistComponent', () => {
  let component: ProjectManagerChecklistComponent;
  let fixture: ComponentFixture<ProjectManagerChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectManagerChecklistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectManagerChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
