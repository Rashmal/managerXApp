import { TestBed } from '@angular/core/testing';

import { CustomTemplateService } from './custom-template.service';

describe('CustomTemplateService', () => {
  let service: CustomTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
