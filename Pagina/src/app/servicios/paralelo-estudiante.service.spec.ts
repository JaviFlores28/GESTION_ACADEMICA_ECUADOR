import { TestBed } from '@angular/core/testing';

import { ParaleloEstudianteService } from './paralelo-estudiante.service';

describe('ParaleloEstudianteService', () => {
  let service: ParaleloEstudianteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParaleloEstudianteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
