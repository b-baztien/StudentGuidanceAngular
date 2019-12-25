import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCareerDialogComponent } from './add-edit-career-dialog.component';

describe('AddEditCareerDialogComponent', () => {
  let component: AddEditCareerDialogComponent;
  let fixture: ComponentFixture<AddEditCareerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCareerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCareerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
