import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shr-popup',
  standalone: false,
  templateUrl: './shr-popup.component.html',
  styleUrl: './shr-popup.component.scss',
})
export class ShrPopupCreateComponent {
  @Input() title: string = '';
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() width: string = '500px';
  @Output() confirmClick = new EventEmitter<any>();
  @Input() textConfirm: string = 'Xác nhận';
  @Output() cancelClick = new EventEmitter<any>();

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
    this.cancelClick.emit(false);
  }

  handleOk() {
    this.confirmClick.emit();
  }
}
