import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMajorImageComponent } from './list-major-image.component';

describe('ListMajorImageComponent', () => {
  let component: ListMajorImageComponent;
  let fixture: ComponentFixture<ListMajorImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMajorImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMajorImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
