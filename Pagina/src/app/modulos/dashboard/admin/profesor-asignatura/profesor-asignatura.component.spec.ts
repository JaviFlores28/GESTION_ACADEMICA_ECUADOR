import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorAsignaturaComponent } from './profesor-asignatura.component';

describe('ProfesorAsignaturaComponent', () => {
  let component: ProfesorAsignaturaComponent;
  let fixture: ComponentFixture<ProfesorAsignaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorAsignaturaComponent]
    });
    fixture = TestBed.createComponent(ProfesorAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
