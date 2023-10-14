import { CartItem } from 'src/app/modules/main/main.component';
import { CustomerProfile } from './customer-profile';

export interface OrderProfile {
  id: string;
  timestamp: number;
  user?: {
    id?: string | null;
    data: CustomerProfile;
  };
  cart: { order: CartItem[]; price: string };
}
