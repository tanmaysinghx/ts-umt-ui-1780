import { TestBed } from '@angular/core/testing';

import { UiTestingService } from './ui-testing.service';

describe('UiTestingService', () => {
  let service: UiTestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiTestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
