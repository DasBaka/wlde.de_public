export interface RestaurantProfile {
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
}
