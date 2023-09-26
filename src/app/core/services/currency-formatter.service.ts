import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyFormatterService {
  formattingObject = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
  });

  constructor() {}

  price(num: number) {
    return this.formattingObject.format(num);
  }

  rtl(s: string) {
    let sNum = s.slice(1, s.length);
    let num = parseInt(sNum.replace(/\D/g, '')) / 100;
    return this.price(num);
  }

  num(s: string) {
    let sNum = s.slice(1, s.length);
    let num = parseInt(sNum.replace(/\D/g, '')) / 100;
    return num;
  }
}
