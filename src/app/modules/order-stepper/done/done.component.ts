import { NumberInput } from '@angular/cdk/coercion';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreDataService } from 'src/app/core/services/firestore-data.service';
import { OrderProfile } from 'src/models/interfaces/order-profile';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.scss'],
})
export class DoneComponent {
  dataService: FirestoreDataService = inject(FirestoreDataService);
  time!: string;
  orderStatus!: string | null | undefined;
  pctTime: NumberInput;
  timestamp!: number;
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
    this.getTime();
  }

  async getTime() {
    this.time = '';
    this.timestamp = parseInt(localStorage.getItem('timestamp') || '');
    await this.getOrderStatus();
    this.timer;
  }

  async getOrderStatus() {
    let orderId = localStorage.getItem('orderId');
    if (orderId) {
      let order = (await this.dataService.getDocData(
        'orders/' + orderId
      )) as OrderProfile & { status?: string };
      this.orderStatus = order.status;
      if (this.orderStatus) {
        this.adjustTime(this.orderStatus);
      }
    }
  }

  adjustTime(status: string) {
    switch (status) {
      case 'process':
        this.timestamp = this.timestamp - 600000;
        break;
      case 'delivery':
        this.timestamp = this.timestamp - 2400000;
        break;
      case 'done':
        this.timestamp = this.timestamp - 3600001;
        break;
      default:
        break;
    }
  }
}
