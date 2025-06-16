import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../../services/common-service/common.service';
import { ContractStatus } from '../../../shared/models';

@Component({
  selector: 'app-popup-edit-contract',
  standalone: false,
  templateUrl: './popup-edit-contract.component.html',
  styleUrl: './popup-edit-contract.component.scss',
})
export class PopupEditContractComponent {
  @Input() title: string = '';
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();
  @Input() actionType: 'view' | 'edit' = 'view';
  @Input() actionTypeChange = new EventEmitter<any>();
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() width: string = '500px';
  @Output() confirmClick = new EventEmitter<any>();
  @Input() textConfirm: string = 'Xác nhận';

  dataInput: any = {};

  constructor(private commonService: CommonService) {}

  ngOnChanges() {
    // this.getListJobPositions(true);
    if (this.data) {
      this.dataInput = { ...this.data };
    }
  }

  // getListJobPositions(event: boolean) {
  //   if (event === true) {
  //     this.commonService.getListJobPositions().subscribe({
  //       next: (res) => {
  //         this.listJobPositions = res.data;
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  //   }
  // }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  handleOk() {
    this.data = { ...this.dataInput };
    this.dataChange.emit(this.data);
    this.confirmClick.emit();
  }

  listJobPositions: any[] = [];
  protected readonly ContractStatus = ContractStatus;
}
