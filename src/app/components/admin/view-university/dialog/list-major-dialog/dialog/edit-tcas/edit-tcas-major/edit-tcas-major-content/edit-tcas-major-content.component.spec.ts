import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTcasMajorContentComponent } from './edit-tcas-major-content.component';

describe('EditTcasMajorContentComponent', () => {
  let component: EditTcasMajorContentComponent;
  let fixture: ComponentFixture<EditTcasMajorContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTcasMajorContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTcasMajorContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
