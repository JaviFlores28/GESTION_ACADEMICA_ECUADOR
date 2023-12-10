import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'es': {
    weekdays: ['L', 'M', 'MI', 'J', 'V', 'S', 'D'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

@Injectable()
export class I18n {
  language = 'es';
}

@Injectable({
  providedIn: 'root'
})
export class NgDatetimepickerESService extends NgbDatepickerI18n {
 
  constructor(private _i18n: I18n) {
    super();
  } 

  override getWeekdayLabel(weekday: number, width?: TranslationWidth | undefined): string {
    return I18N_VALUES[this._i18n.language as keyof typeof I18N_VALUES].weekdays[weekday - 1];
  }
  override getMonthShortName(month: number, year?: number | undefined): string {
    return I18N_VALUES[this._i18n.language as keyof typeof I18N_VALUES].months[month - 1];
  }
  override getMonthFullName(month: number, year?: number | undefined): string {
    return this.getMonthShortName(month);
  }
  override getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}