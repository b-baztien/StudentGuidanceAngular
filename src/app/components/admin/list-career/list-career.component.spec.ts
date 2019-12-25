import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCareerComponent } from './list-career.component';

describe('ListCareerComponent', () => {
  let component: ListCareerComponent;
  let fixture: ComponentFixture<ListCareerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCareerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
