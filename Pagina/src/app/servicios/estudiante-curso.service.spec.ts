import { TestBed } from '@angular/core/testing';

import { EstudianteCursoService } from './estudiante-curso.service';

describe('EstudianteCursoService', () => {
  let service: EstudianteCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstudianteCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
