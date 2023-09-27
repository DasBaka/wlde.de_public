import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStepperComponent } from './order-stepper.component';

describe('OrderStepperComponent', () => {
  let component: OrderStepperComponent;
  let fixture: ComponentFixture<OrderStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderStepperComponent]
    });
    fixture = TestBed.createComponent(OrderStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
