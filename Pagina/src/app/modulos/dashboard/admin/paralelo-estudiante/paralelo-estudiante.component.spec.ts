import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaleloEstudianteComponent } from './paralelo-estudiante.component';

describe('ParaleloEstudianteComponent', () => {
  let component: ParaleloEstudianteComponent;
  let fixture: ComponentFixture<ParaleloEstudianteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParaleloEstudianteComponent]
    });
    fixture = TestBed.createComponent(ParaleloEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
