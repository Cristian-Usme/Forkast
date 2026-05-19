export type MealData = {
  name: string;
  image: string;
  calories: string;
} | null;

export type MenuData = Record<string, Record<string, MealData>>;

export type BottomNavItemId = 'home' | 'menu' | 'shopping' | 'inventory' | 'stats';

export interface BottomNavProps {
  active: BottomNavItemId;
}

export interface ShoppingItem {
  id: number;
  name: string;
  quantity: string;
  price: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: string;
  purchased: string;
  expires: string;
  warning: boolean;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}
