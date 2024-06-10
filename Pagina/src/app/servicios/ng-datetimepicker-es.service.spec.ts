import { TestBed } from '@angular/core/testing';

import { NgDatetimepickerESService } from './ng-datetimepicker-es.service';

describe('NgDatetimepickerESService', () => {
  let service: NgDatetimepickerESService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgDatetimepickerESService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
