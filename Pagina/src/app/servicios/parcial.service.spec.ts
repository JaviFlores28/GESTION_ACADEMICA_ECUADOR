import { TestBed } from '@angular/core/testing';

import { ParcialService } from './parcial.service';

describe('ParcialService', () => {
  let service: ParcialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
