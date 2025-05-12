import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shr-pagination',
  standalone: false,
  templateUrl: './shr-pagination.component.html',
  styleUrl: './shr-pagination.component.scss',
})
export class ShrPaginationComponent {
  @Input() pageNumber: number = 0;
  @Input() pageSize: number = 0;
  @Input() total: number = 0;
  @Output() pageNumberChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  changePage(event: number) {
    this.pageNumber = event;
    this.pageNumberChange.emit(this.pageNumber);
    this.pageSizeChange.emit(this.pageSize);
  }

  changePageSize(event: number) {
    this.pageSize = event;
    this.pageNumberChange.emit(this.pageNumber);
    this.pageSizeChange.emit(this.pageSize);
  }
}
