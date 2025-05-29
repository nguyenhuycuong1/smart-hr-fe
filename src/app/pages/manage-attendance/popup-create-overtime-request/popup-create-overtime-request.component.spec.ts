import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCreateOvertimeRequestComponent } from './popup-create-overtime-request.component';

describe('PopupCreateOvertimeRequestComponent', () => {
  let component: PopupCreateOvertimeRequestComponent;
  let fixture: ComponentFixture<PopupCreateOvertimeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupCreateOvertimeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCreateOvertimeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
