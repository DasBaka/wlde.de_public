export interface DishProfile {
  name: string | null;
  text: string | null;
  cost: string | null;
  tags: Array<string> | null;
  id?: string;
}
