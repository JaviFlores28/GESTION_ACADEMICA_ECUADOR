import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteComponent } from './estudiante.component';

describe('EstudianteComponent', () => {
  let component: EstudianteComponent;
  let fixture: ComponentFixture<EstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteComponent]
    });
    fixture = TestBed.createComponent(EstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
