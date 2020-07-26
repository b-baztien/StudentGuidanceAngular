import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTcasUniversityDialogComponent } from './edit-tcas-university-dialog.component';

describe('EditTcasUniversityDialogComponent', () => {
  let component: EditTcasUniversityDialogComponent;
  let fixture: ComponentFixture<EditTcasUniversityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTcasUniversityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTcasUniversityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
