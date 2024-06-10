import { TestBed } from '@angular/core/testing';

import { EstudianteCursoParaleloService } from './estudiante-curso-paralelo.service';

describe('EstudianteCursoParaleloService', () => {
  let service: EstudianteCursoParaleloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstudianteCursoParaleloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
