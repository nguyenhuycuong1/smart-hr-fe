import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOvertimeRequestComponent } from './list-overtime-request.component';

describe('ListOvertimeRequestComponent', () => {
  let component: ListOvertimeRequestComponent;
  let fixture: ComponentFixture<ListOvertimeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListOvertimeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOvertimeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
