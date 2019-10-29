import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarrerComponent } from './list-carrer.component';

describe('ListCarrerComponent', () => {
  let component: ListCarrerComponent;
  let fixture: ComponentFixture<ListCarrerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCarrerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCarrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
