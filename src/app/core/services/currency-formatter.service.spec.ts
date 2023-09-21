import { TestBed } from '@angular/core/testing';

import { CurrencyFormatterService } from './currency-formatter.service';

describe('CurrencyFormatterService', () => {
  let service: CurrencyFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
