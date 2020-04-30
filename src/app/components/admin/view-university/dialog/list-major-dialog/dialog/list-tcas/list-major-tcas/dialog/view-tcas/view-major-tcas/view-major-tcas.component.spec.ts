import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMajorTcasComponent } from './view-major-tcas.component';

describe('ViewMajorTcasComponent', () => {
  let component: ViewMajorTcasComponent;
  let fixture: ComponentFixture<ViewMajorTcasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMajorTcasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMajorTcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
