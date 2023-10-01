export interface CustomerProfile {
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
}
