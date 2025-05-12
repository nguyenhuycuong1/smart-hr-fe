import { Component, EventEmitter, Input, output, Output } from '@angular/core';

@Component({
  selector: 'shr-popup-confirm',
  standalone: false,
  templateUrl: './shr-popup-confirm.component.html',
  styleUrl: './shr-popup-confirm.component.scss',
})
export class ShrPopupConfirmComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() typePopup: 'add' | 'update' | 'delete' | '' = '';
  @Input() title: string = '';
  @Input() dataName: string = '';
  @Input() currentDataName: string | undefined = '';
  @Input() message: string = '';
  @Input() confirmText: string = 'Đồng ý';
  @Input() cancelText: string = 'Hủy bỏ';
  @Input() dangerButton: boolean = false;
  @Output() confirm = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() recallData = new EventEmitter();

  handleConfirm() {
    this.confirm.emit();
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
    this.recallData.emit();
  }

  handleCancel() {
    this.cancel.emit();
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleRecallData() {
    this.recallData.emit();
  }
}
