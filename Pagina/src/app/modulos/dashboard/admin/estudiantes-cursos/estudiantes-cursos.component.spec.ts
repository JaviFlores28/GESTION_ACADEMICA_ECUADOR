import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantesCursosComponent } from './estudiantes-cursos.component';

describe('EstudiantesCursosComponent', () => {
  let component: EstudiantesCursosComponent;
  let fixture: ComponentFixture<EstudiantesCursosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudiantesCursosComponent]
    });
    fixture = TestBed.createComponent(EstudiantesCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
