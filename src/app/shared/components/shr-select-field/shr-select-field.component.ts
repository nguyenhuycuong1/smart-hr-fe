import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../../services/common-service/common.service';
import { PageFilterRequest } from '../../models';

@Component({
  selector: 'shr-select-field',
  standalone: false,
  templateUrl: './shr-select-field.component.html',
  styleUrl: './shr-select-field.component.scss',
})
export class ShrSelectFieldComponent {
  @Input() tableName: string = '';
  @Input() fieldName: string = '';
  @Input() fieldValue: string = '';
  @Input() selected: any = '';
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() filter: any = {};

  @Input() title: string = '';
  @Input() isDisabled: boolean = false;

  constructor(private commonService: CommonService) {}

  ngOnChanges() {
    this.getListSelectField();
  }

  ngOnInit() {
    // this.getListSelectField();
  }

  getListSelectField() {
    const request: PageFilterRequest<any> = {
      pageNumber: 0,
      pageSize: 0,
      filter: this.filter,
    };
    this.commonService.getListToSelectFieldWithFilter(this.tableName, request).subscribe((res) => {
      this.listSelectField = res.data;
    });
  }

  onSelect(event: any) {
    this.selectedChange.emit(event);
  }

  listSelectField: any[] = [];
}
