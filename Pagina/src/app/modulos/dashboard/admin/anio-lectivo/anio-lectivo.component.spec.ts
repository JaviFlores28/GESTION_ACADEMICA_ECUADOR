import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnioLectivoComponent } from './anio-lectivo.component';

describe('AnioLectivoComponent', () => {
  let component: AnioLectivoComponent;
  let fixture: ComponentFixture<AnioLectivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnioLectivoComponent]
    });
    fixture = TestBed.createComponent(AnioLectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
