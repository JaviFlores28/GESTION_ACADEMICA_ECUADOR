import { TestBed } from '@angular/core/testing';

import { ProvinciasServiceService } from './provincias.service';

describe('ProvinciasServiceService', () => {
  let service: ProvinciasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvinciasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
