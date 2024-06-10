import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantesParalelosComponent } from './estudiantes-paralelos.component';

describe('EstudiantesParalelosComponent', () => {
  let component: EstudiantesParalelosComponent;
  let fixture: ComponentFixture<EstudiantesParalelosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudiantesParalelosComponent]
    });
    fixture = TestBed.createComponent(EstudiantesParalelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
