import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';
import { BehaviorSubject, debounce, debounceTime, Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'shr-button',
  standalone: false,
  templateUrl: './shr-button.component.html',
  styleUrl: './shr-button.component.scss',
})
export class ShrButtonComponent {
  @Input() type: NzButtonType = 'primary';
  @Input() leftIcon: string = '';
  @Input() rightIcon: string = '';
  @Input() content: string = '';
  @Input() size: NzButtonSize = 'default';
  @Input() isDanger: boolean = false;
  @Input() bgColor: 'yellow' | 'green' | 'red' | 'blue' | '' = '';

  @Output() emitClick: EventEmitter<any> = new EventEmitter();
  private click$ = new Subject<void>();

  ngOnInit() {
    // Tránh người dùng click quá nhanh vào button
    this.click$.pipe(debounceTime(300)).subscribe(() => {
      this.emitClick.emit();
    });
  }

  handleClickAction() {
    this.click$.next();
  }
}
