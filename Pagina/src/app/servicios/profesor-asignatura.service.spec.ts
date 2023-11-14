import { TestBed } from '@angular/core/testing';

import { ProfesorAsignaturaService } from './profesor-asignatura.service';

describe('ProfesorAsignaturaService', () => {
  let service: ProfesorAsignaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesorAsignaturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
