import { NumberInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.scss'],
})
export class DoneComponent {
  time: string;
  pctTime: NumberInput;
  timestamp: number;
  timer = setInterval(() => {
    let t = Date.now() - this.timestamp;
    this.time = new Date(3600000 - t).toISOString().slice(14, 19);
    this.pctTime = parseInt((t / 36000).toFixed(2));
    if (t >= 3600000) {
      clearInterval(this.timer);
      this.time = '00:00';
      this.pctTime = 100;
    }
  }, 1000);

  constructor(public router: Router) {
    this.time = '';
    this.timestamp = parseInt(localStorage.getItem('timestamp') || '');
    this.timer;
  }
}
