import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AniosLectivosComponent } from './anios-lectivos.component';

describe('AniosLectivosComponent', () => {
  let component: AniosLectivosComponent;
  let fixture: ComponentFixture<AniosLectivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AniosLectivosComponent]
    });
    fixture = TestBed.createComponent(AniosLectivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
