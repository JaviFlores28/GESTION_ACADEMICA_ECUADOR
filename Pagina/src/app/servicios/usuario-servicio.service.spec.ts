import { TestBed } from '@angular/core/testing';

import { UsuarioServicioService } from './usuario-servicio.service';

describe('UsuarioServicioService', () => {
  let service: UsuarioServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
