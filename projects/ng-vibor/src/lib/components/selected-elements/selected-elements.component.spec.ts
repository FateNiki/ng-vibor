import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedElementsComponent } from './selected-elements.component';
import { TestViborModule } from '../../testing.module';

describe('SelectedElementsComponent', () => {
  let component: SelectedElementsComponent;
  let fixture: ComponentFixture<SelectedElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(TestViborModule)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
