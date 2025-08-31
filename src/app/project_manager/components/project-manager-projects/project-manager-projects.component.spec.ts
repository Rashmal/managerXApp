import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerProjectsComponent } from './project-manager-projects.component';

describe('ProjectManagerProjectsComponent', () => {
  let component: ProjectManagerProjectsComponent;
  let fixture: ComponentFixture<ProjectManagerProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectManagerProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectManagerProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
