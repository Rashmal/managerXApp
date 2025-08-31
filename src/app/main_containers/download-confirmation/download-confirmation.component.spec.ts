import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadConfirmationComponent } from './download-confirmation.component';

describe('DownloadConfirmationComponent', () => {
  let component: DownloadConfirmationComponent;
  let fixture: ComponentFixture<DownloadConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
