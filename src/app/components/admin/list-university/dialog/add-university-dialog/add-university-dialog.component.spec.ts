import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUniversityDialogComponent } from './add-university-dialog.component';

describe('AddUniversityDialogComponent', () => {
  let component: AddUniversityDialogComponent;
  let fixture: ComponentFixture<AddUniversityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUniversityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUniversityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
