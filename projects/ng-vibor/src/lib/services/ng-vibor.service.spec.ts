import { TestBed } from '@angular/core/testing';

import { NgViborService } from './ng-vibor.service';

describe('NgViborService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgViborService<any> = TestBed.get(NgViborService);
    expect(service).toBeTruthy();
  });
});
