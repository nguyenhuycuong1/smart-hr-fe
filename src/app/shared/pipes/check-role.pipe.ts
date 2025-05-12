import { Pipe, PipeTransform } from '@angular/core';
import { BaseService } from '../../services/app-service/base.service';

@Pipe({
  name: 'checkRole',
  standalone: false,
})
export class CheckRolePipe implements PipeTransform {
  constructor(private baseService: BaseService) {}

  transform(value: string[], ...args: unknown[]): boolean {
    return !this.baseService.isCheckRoles(value);
  }
}
