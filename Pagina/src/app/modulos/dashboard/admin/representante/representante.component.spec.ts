import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentanteComponent } from './representante.component';

describe('RepresentanteComponent', () => {
  let component: RepresentanteComponent;
  let fixture: ComponentFixture<RepresentanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepresentanteComponent]
    });
    fixture = TestBed.createComponent(RepresentanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
