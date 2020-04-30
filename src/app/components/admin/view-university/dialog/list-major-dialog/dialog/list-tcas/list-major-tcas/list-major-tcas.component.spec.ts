import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMajorTcasComponent } from './list-major-tcas.component';

describe('ListMajorTcasComponent', () => {
  let component: ListMajorTcasComponent;
  let fixture: ComponentFixture<ListMajorTcasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMajorTcasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMajorTcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
