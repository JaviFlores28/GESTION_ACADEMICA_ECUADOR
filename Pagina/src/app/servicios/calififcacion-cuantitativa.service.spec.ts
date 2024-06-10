import { TestBed } from '@angular/core/testing';

import { CalififcacionCuantitativaService } from './calififcacion-cuantitativa.service';

describe('CalififcacionCuantitativaService', () => {
  let service: CalififcacionCuantitativaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalififcacionCuantitativaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
