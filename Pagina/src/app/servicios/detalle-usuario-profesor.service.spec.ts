import { TestBed } from '@angular/core/testing';

import { DetalleUsuarioProfesorService } from './detalle-usuario-profesor.service';

describe('DetalleUsuarioProfesorService', () => {
  let service: DetalleUsuarioProfesorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleUsuarioProfesorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
