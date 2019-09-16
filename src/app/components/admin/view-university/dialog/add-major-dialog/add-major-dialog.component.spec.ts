import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMajorDialogComponent } from './add-major-dialog.component';

describe('AddMajorDialogComponent', () => {
  let component: AddMajorDialogComponent;
  let fixture: ComponentFixture<AddMajorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMajorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMajorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
