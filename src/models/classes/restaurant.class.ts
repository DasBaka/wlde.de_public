import { RestaurantProfile } from '../interfaces/restaurant-profile.interface';

export class Restaurant implements RestaurantProfile {
  responsible: {
    firstname: string | null;
    lastname: string | null;
  };
  address: {
    city: string | null;
    house: string | null;
    postalCode: string | null;
    street: string | null;
  };
  contact: {
    mail: string | null;
    phone: string | null;
  };
  hours: Array<{}>;

  constructor(data?: RestaurantProfile) {
    this.responsible = data?.responsible ?? {
      firstname: null,
      lastname: null,
    };
    this.address = data?.address ?? {
      city: null,
      house: null,
      postalCode: null,
      street: null,
    };
    this.contact = data?.contact ?? {
      mail: null,
      phone: null,
    };
    this.hours = data?.hours ?? this.fillWithDays();
  }

  fillWithDays() {
    let weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    let res: Array<{}> = [];
    weekdays.forEach((day: string) => {
      res.push({
        day: day,
        isOpen: false,
        time: { from: '4:00 PM', to: '5:00 PM' },
      });
    });
    return res;
  }
}
