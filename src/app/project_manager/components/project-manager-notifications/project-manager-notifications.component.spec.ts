import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerNotificationsComponent } from './project-manager-notifications.component';

describe('ProjectManagerNotificationsComponent', () => {
  let component: ProjectManagerNotificationsComponent;
  let fixture: ComponentFixture<ProjectManagerNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectManagerNotificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectManagerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
