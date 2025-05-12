import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../../services/common-service/common.service';
import { ApiResponse } from '../../models';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'shr-select-param',
  standalone: false,
  templateUrl: './shr-select-param.component.html',
  styleUrl: './shr-select-param.component.scss',
})
export class ShrSelectParamComponent {
  @Input() tableName: string = '';
  @Input() columnName: string = '';
  @Output() emitValue = new EventEmitter<any>();
  @Input() title: string = '';

  @Input() selected: any = '';
  @Output() selectedChange = new EventEmitter<any>();
  listParam: any[] = [];

  constructor(private commonService: CommonService, private message: NzMessageService) {}

  ngOnInit() {
    this.getParamByTableNameAndColumnName(true);
  }

  ngOnDestroy() {
    this.listParam = [];
  }
  onChange(event: any) {
    this.selectedChange.emit(event);
  }

  getParamByTableNameAndColumnName(event: boolean) {
    if (event === true) {
      this.commonService.getParams(this.tableName, this.columnName).subscribe({
        next: (res: ApiResponse<any>) => {
          this.listParam = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  // popup add param

  isVisibleAddParam: boolean = false;
  openPopupAddParam() {
    this.isVisibleAddParam = true;
  }

  handleCancel() {
    this.isVisibleAddParam = false;
    // this.listParam = [];
    this.listParam = this.listParam.filter((item) => item.value != '');
  }

  handleOk() {
    const request = this.listParam.map((item) => {
      return { table_name: this.tableName, column_name: this.columnName, ...item };
    });
    this.commonService.createBatchParam(request).subscribe({
      next: (res) => {
        this.message.success(`Thành công!`);
        this.handleCancel();
      },
      error: (err) => {
        this.message.error('Thất bại');
      },
    });
  }

  addRow() {
    this.listParam.unshift({ value: '', description: '' });
  }

  deleteElement: any = {};
  isVisibleCofirm: boolean = false;
  openPopupConfirm(data: any, index: number) {
    this.deleteElement = data;
    if (this.deleteElement.id) {
      this.isVisibleCofirm = true;
    } else {
      this.listParam.splice(index, 1);
    }
  }

  deleteRow() {
    this.commonService.deleteParam(this.deleteElement.id).subscribe({
      next: (res) => {
        this.message.success('Thành công!');
        this.getParamByTableNameAndColumnName(true);
      },
      error: () => {
        this.message.error('Thất bại!');
      },
    });
  }
}
