import { TestBed } from '@angular/core/testing';

import { HeightForOutletService } from './height-for-outlet.service';

describe('HeightForOutletService', () => {
  let service: HeightForOutletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeightForOutletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
