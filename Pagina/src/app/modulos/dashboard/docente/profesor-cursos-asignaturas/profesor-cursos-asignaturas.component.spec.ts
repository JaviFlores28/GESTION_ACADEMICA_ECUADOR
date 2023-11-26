import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorCursosAsignaturasComponent } from './profesor-cursos-asignaturas.component';

describe('ProfesorCursosAsignaturasComponent', () => {
  let component: ProfesorCursosAsignaturasComponent;
  let fixture: ComponentFixture<ProfesorCursosAsignaturasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorCursosAsignaturasComponent]
    });
    fixture = TestBed.createComponent(ProfesorCursosAsignaturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
