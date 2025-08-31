import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerContactsComponent } from './project-manager-contacts.component';

describe('ProjectManagerContactsComponent', () => {
  let component: ProjectManagerContactsComponent;
  let fixture: ComponentFixture<ProjectManagerContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectManagerContactsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectManagerContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
