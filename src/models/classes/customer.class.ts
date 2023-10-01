import { CustomerProfile } from '../interfaces/customer-profile';

export class Customer implements CustomerProfile {
  customer: {
    firstname: string | null;
    lastname: string | null;
    company?: string | null;
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

  constructor(data?: CustomerProfile) {
    this.customer = data?.customer ?? {
      firstname: null,
      lastname: null,
      company: null,
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
  }
}
