import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorHorariosComponent } from './profesor-horarios.component';

describe('ProfesorHorariosComponent', () => {
  let component: ProfesorHorariosComponent;
  let fixture: ComponentFixture<ProfesorHorariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorHorariosComponent]
    });
    fixture = TestBed.createComponent(ProfesorHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
