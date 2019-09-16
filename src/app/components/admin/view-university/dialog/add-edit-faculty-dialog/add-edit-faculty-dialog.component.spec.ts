import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFacultyDialogComponent } from './add-edit-faculty-dialog.component';

describe('AddEditFacultyDialogComponent', () => {
  let component: AddEditFacultyDialogComponent;
  let fixture: ComponentFixture<AddEditFacultyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditFacultyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFacultyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
