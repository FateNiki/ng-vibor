import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestViborComponent } from './ng-vibor-test.component';

describe('NgViborComponent', () => {
  let component: TestViborComponent;
  let fixture: ComponentFixture<TestViborComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestViborComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestViborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
