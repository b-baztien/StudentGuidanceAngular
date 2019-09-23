import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUniversityComponent } from './delete-university.component';

describe('DeleteUniversityComponent', () => {
  let component: DeleteUniversityComponent;
  let fixture: ComponentFixture<DeleteUniversityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteUniversityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
