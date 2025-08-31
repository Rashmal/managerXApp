import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectPersonComponent } from './reject-person.component';

describe('RejectPersonComponent', () => {
  let component: RejectPersonComponent;
  let fixture: ComponentFixture<RejectPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectPersonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
