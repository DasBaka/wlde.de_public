import { DataSource } from '@angular/cdk/collections';
import { ElementRef, Injectable } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FilterTableService {
  constructor() {}

  isPartOfString(base: string, compare: string) {
    return base.toLowerCase().search(compare) != -1;
  }

  inputValue(input: ElementRef) {
    return input.nativeElement.value.replace(/^\s+|\s+$/g, '').toLowerCase();
  }
}
