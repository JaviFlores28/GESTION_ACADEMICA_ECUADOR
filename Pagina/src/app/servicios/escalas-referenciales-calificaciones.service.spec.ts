import { TestBed } from '@angular/core/testing';

import { EscalasReferencialesCalificacionesService } from './escalas-referenciales-calificaciones.service';

describe('EscalasReferencialesCalificacionesService', () => {
  let service: EscalasReferencialesCalificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscalasReferencialesCalificacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
