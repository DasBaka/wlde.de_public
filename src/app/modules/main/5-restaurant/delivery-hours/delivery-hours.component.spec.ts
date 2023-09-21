import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryHoursComponent } from './delivery-hours.component';

describe('DeliveryHoursComponent', () => {
  let component: DeliveryHoursComponent;
  let fixture: ComponentFixture<DeliveryHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryHoursComponent]
    });
    fixture = TestBed.createComponent(DeliveryHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
