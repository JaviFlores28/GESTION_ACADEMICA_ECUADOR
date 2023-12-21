import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCalificacionesComponent } from './reporte-calificaciones.component';

describe('ReporteCalificacionesComponent', () => {
  let component: ReporteCalificacionesComponent;
  let fixture: ComponentFixture<ReporteCalificacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteCalificacionesComponent]
    });
    fixture = TestBed.createComponent(ReporteCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
