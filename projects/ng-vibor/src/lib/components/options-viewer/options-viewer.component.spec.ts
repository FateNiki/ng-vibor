import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsViewerComponent } from './options-viewer.component';
import { TestViborModule, getDataSource } from '../../testing.module';

describe('OptionsViewerComponent', () => {
  let component: OptionsViewerComponent;
  let fixture: ComponentFixture<OptionsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(TestViborModule)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsViewerComponent);
    component = fixture.componentInstance;
    component.dataSource = getDataSource();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
