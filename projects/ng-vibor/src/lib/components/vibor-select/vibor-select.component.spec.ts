import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViborSelectComponent } from './vibor-select.component';

describe('ViborSelectComponent', () => {
  let component: ViborSelectComponent;
  let fixture: ComponentFixture<ViborSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViborSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViborSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
