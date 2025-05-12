import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'handleLableSelectField',
  standalone: false,
})
export class HandleLableSelectFieldPipe implements PipeTransform {
  transform(dataField: any, fieldName: string, ...args: unknown[]): any {
    if (dataField && fieldName) {
      if (fieldName.includes('.')) {
        const arr = fieldName.split('.');
        let value = dataField;
        for (let i = 0; i < arr.length; i++) {
          value = value[arr[i]];
        }
        return value;
      } else {
        return dataField[fieldName] || null;
      }
    }
    return null;
  }
}
