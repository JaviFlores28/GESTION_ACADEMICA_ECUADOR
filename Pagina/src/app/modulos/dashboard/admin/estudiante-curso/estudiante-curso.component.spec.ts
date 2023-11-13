import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteCursoComponent } from './estudiante-curso.component';

describe('EstudianteCursoComponent', () => {
  let component: EstudianteCursoComponent;
  let fixture: ComponentFixture<EstudianteCursoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteCursoComponent]
    });
    fixture = TestBed.createComponent(EstudianteCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
