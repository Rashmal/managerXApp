import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptPersonComponent } from './accept-person.component';

describe('AcceptPersonComponent', () => {
  let component: AcceptPersonComponent;
  let fixture: ComponentFixture<AcceptPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptPersonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
