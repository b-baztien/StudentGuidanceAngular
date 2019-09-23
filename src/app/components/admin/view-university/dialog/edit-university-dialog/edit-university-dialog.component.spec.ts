import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUniversityDialogComponent } from './edit-university-dialog.component';

describe('EditUniversityComponent', () => {
  let component: EditUniversityDialogComponent;
  let fixture: ComponentFixture<EditUniversityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUniversityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUniversityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
