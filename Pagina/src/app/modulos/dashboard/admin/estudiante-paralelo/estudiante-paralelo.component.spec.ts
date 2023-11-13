import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteParaleloComponent } from './estudiante-paralelo.component';

describe('EstudianteParaleloComponent', () => {
  let component: EstudianteParaleloComponent;
  let fixture: ComponentFixture<EstudianteParaleloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteParaleloComponent]
    });
    fixture = TestBed.createComponent(EstudianteParaleloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
