import { TestBed } from '@angular/core/testing';

import { NgViborService } from './ng-vibor.service';
import { TestViborModule } from '../testing.module';

describe('NgViborService', () => {
  beforeEach(() => TestBed.configureTestingModule(TestViborModule));

  it('should be created', () => {
    const service: NgViborService<any> = TestBed.get(NgViborService);
    expect(service).toBeTruthy();
  });
});
