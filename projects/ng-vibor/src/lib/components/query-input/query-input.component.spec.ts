import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryInputComponent } from './query-input.component';
import { TestViborModule } from '../../testing.module';

describe('QueryInputComponent', () => {
  let component: QueryInputComponent;
  let fixture: ComponentFixture<QueryInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule(TestViborModule)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
