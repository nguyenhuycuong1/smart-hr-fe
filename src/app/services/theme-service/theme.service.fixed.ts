import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentColorSubject = new BehaviorSubject<string>('#39A5AA');
  currentColor$ = this.currentColorSubject.asObservable();
  private cssLoaded = false;

  constructor() {
    // Load theme overrides CSS
    this.loadThemeOverridesCSS();

    // Khoi phuc mau tu localStorage khi khoi tao service
    const savedColor = localStorage.getItem('business_color');
    if (savedColor) {
      this.currentColorSubject.next(savedColor);
      this.applyThemeColor(savedColor);
    }
  }

  private loadThemeOverridesCSS() {
    if (!this.cssLoaded) {
      const link = document.createElement('link');
      link.href = 'assets/css/theme-overrides.css';
      link.rel = 'stylesheet';
      link.id = 'theme-overrides-css';
      document.head.appendChild(link);
      this.cssLoaded = true;
    }
  }

  changePrimaryColor(color: string) {
    if (!color) {
      console.warn('Invalid color provided');
      return Promise.resolve();
    }

    // Cap nhat BehaviorSubject
    this.currentColorSubject.next(color);

    // Luu vao localStorage
    localStorage.setItem('business_color', color);

    // Ap dung mau qua CSS Variables
    this.applyThemeColor(color);

    return Promise.resolve();
  }

  // Phuong thuc ap dung mau thong qua CSS Variables
  private applyThemeColor(color: string) {
    // 1. Cap nhat CSS variable goc
    document.documentElement.style.setProperty('--primary-color', color);

    // 2. Tinh toan cac bien the cua mau
    const hover = this.adjustOpacity(color, 0.2);
    const active = this.adjustOpacity(color, 0.7);
    const lighter = this.lightenColor(color, 30);
    const darker = this.darkenColor(color, 10);

    document.documentElement.style.setProperty('--primary-color-hover', hover);
    document.documentElement.style.setProperty('--primary-color-active', active);
    document.documentElement.style.setProperty('--primary-color-lighter', lighter);
    document.documentElement.style.setProperty('--primary-color-darker', darker);
  }

  // Ham dieu chinh do trong suot cua mau
  private adjustOpacity(hexColor: string, opacity: number): string {
    try {
      // Loai bo # neu co
      const hex = hexColor.replace('#', '');

      // Chuyen doi sang RGB
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Tra ve chuoi rgba
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } catch (e) {
      console.error('Error adjusting color opacity:', e);
      return `rgba(57, 165, 170, ${opacity})`; // Fallback to default
    }
  }

  // Lam sang mau
  private lightenColor(hexColor: string, percent: number): string {
    try {
      // Loai bo # neu co
      const hex = hexColor.replace('#', '');

      // Chuyen doi sang RGB
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      // Lam sang
      r = Math.min(255, Math.floor((r * (100 + percent)) / 100));
      g = Math.min(255, Math.floor((g * (100 + percent)) / 100));
      b = Math.min(255, Math.floor((b * (100 + percent)) / 100));

      // Chuyen lai sang hex
      const rr = r.toString(16).padStart(2, '0');
      const gg = g.toString(16).padStart(2, '0');
      const bb = b.toString(16).padStart(2, '0');

      return `#${rr}${gg}${bb}`;
    } catch (e) {
      console.error('Error lightening color:', e);
      return hexColor; // Tra ve mau ban dau neu co loi
    }
  }

  // Lam toi mau
  private darkenColor(hexColor: string, percent: number): string {
    try {
      // Loai bo # neu co
      const hex = hexColor.replace('#', '');

      // Chuyen doi sang RGB
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      // Lam toi
      r = Math.max(0, Math.floor((r * (100 - percent)) / 100));
      g = Math.max(0, Math.floor((g * (100 - percent)) / 100));
      b = Math.max(0, Math.floor((b * (100 - percent)) / 100));

      // Chuyen lai sang hex
      const rr = r.toString(16).padStart(2, '0');
      const gg = g.toString(16).padStart(2, '0');
      const bb = b.toString(16).padStart(2, '0');

      return `#${rr}${gg}${bb}`;
    } catch (e) {
      console.error('Error darkening color:', e);
      return hexColor; // Tra ve mau ban dau neu co loi
    }
  }
}
