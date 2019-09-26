import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewsDialogComponent } from './add-news-dialog.component';

describe('AddNewsDialogComponent', () => {
  let component: AddNewsDialogComponent;
  let fixture: ComponentFixture<AddNewsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
