import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMajorDialogComponent } from './list-major-dialog.component';

describe('ListMajorDialogComponent', () => {
  let component: ListMajorDialogComponent;
  let fixture: ComponentFixture<ListMajorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMajorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMajorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
