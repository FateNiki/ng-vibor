import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestViborComponent } from './ng-vibor-test.component';
import { TestViborModule, getConnector } from '../testing.module';

describe('NgViborTestComponent', () => {
  let component: TestViborComponent;
  let fixture: ComponentFixture<TestViborComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(TestViborModule)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestViborComponent);
    component = fixture.componentInstance;
    component.connector = getConnector();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
