import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupViewAttendanceRecordComponent } from './popup-view-attendance-record.component';

describe('PopupViewAttendanceRecordComponent', () => {
  let component: PopupViewAttendanceRecordComponent;
  let fixture: ComponentFixture<PopupViewAttendanceRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupViewAttendanceRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupViewAttendanceRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
