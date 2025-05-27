import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  /**
   * Chuyển đối tượng Date thành chuỗi thời gian theo định dạng HH:mm:ss
   * @param timeString Chuỗi thời gian hoặc đối tượng Date
   * @returns Chuỗi thời gian theo định dạng HH:mm:ss
   */
  formatTimeToLocalTime(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }

  /**
   * Chuyển đổi chuỗi thời gian (HH:mm:ss) thành đối tượng Date
   * @param timeString Chuỗi thời gian
   * @returns Đối tượng Date
   */
  parseTimeStringToDate(timeString: string | Date): Date {
    if (timeString instanceof Date) {
      return timeString;
    }

    const today = new Date();
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || (seconds !== undefined && isNaN(seconds))) {
      console.error('Invalid time format:', timeString);
      return today;
    }

    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      seconds || 0,
    );
    return date;
  }
}
