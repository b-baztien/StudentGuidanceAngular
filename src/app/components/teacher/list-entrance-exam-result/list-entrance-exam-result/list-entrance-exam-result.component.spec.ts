import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntranceExamResultComponent } from './list-entrance-exam-result.component';

describe('ListEntranceExamResultComponent', () => {
  let component: ListEntranceExamResultComponent;
  let fixture: ComponentFixture<ListEntranceExamResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEntranceExamResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEntranceExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
