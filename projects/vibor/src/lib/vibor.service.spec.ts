import { TestBed } from '@angular/core/testing';

import { ViborService } from './vibor.service';

describe('ViborService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViborService = TestBed.get(ViborService);
    expect(service).toBeTruthy();
  });
});
