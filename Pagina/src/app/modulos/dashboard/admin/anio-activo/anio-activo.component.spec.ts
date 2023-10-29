import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnioActivoComponent } from './anio-activo.component';

describe('AnioActivoComponent', () => {
  let component: AnioActivoComponent;
  let fixture: ComponentFixture<AnioActivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnioActivoComponent]
    });
    fixture = TestBed.createComponent(AnioActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
