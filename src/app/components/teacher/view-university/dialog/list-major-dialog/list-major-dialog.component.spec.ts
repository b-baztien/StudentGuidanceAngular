import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMajorTeacherDialogComponent } from './list-major-dialog.component';

describe('ListMajorDialogComponent', () => {
  let component: ListMajorTeacherDialogComponent;
  let fixture: ComponentFixture<ListMajorTeacherDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMajorTeacherDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMajorTeacherDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
