import { TestBed } from '@angular/core/testing';

import { UsuarioProfesorService } from './usuario-profesor.service';

describe('UsuarioProfesorService', () => {
  let service: UsuarioProfesorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioProfesorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
