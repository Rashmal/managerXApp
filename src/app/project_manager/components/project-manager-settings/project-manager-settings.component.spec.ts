import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerSettingsComponent } from './project-manager-settings.component';

describe('ProjectManagerSettingsComponent', () => {
  let component: ProjectManagerSettingsComponent;
  let fixture: ComponentFixture<ProjectManagerSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectManagerSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectManagerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
