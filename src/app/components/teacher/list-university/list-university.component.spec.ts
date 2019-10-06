import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUniversityTeacherComponent } from './list-university.component';

describe('ListUniversityComponent', () => {
  let component: ListUniversityTeacherComponent;
  let fixture: ComponentFixture<ListUniversityTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUniversityTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUniversityTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
