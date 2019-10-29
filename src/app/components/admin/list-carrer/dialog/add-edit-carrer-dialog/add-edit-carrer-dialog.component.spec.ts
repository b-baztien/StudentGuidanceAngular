import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCarrerDialogComponent } from './add-edit-carrer-dialog.component';

describe('AddEditCarrerDialogComponent', () => {
  let component: AddEditCarrerDialogComponent;
  let fixture: ComponentFixture<AddEditCarrerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCarrerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCarrerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
