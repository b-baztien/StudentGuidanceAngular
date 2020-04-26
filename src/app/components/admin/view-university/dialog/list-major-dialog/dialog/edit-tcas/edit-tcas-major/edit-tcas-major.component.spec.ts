import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTcasMajorComponent } from './edit-tcas-major.component';

describe('EditTcasMajorComponent', () => {
  let component: EditTcasMajorComponent;
  let fixture: ComponentFixture<EditTcasMajorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTcasMajorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTcasMajorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
