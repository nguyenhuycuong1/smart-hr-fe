import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCreateAttendanceComponent } from './popup-create-attendance.component';

describe('PopupCreateAttendanceComponent', () => {
  let component: PopupCreateAttendanceComponent;
  let fixture: ComponentFixture<PopupCreateAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupCreateAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCreateAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
