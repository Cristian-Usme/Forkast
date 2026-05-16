import type { MenuData } from '@/types';

export const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const meals = ['Desayuno', 'Almuerzo', 'Cena'];

export const menuData: MenuData = {
  Lunes: {
    Desayuno: { name: 'Avena', image: '🥣', calories: '250 kcal' },
    Almuerzo: { name: 'Salteado de Vegetales', image: '🥗', calories: '320 kcal' },
    Cena: { name: 'Pasta', image: '🍝', calories: '380 kcal' }
  },
  Martes: {
    Desayuno: { name: 'Tostadas', image: '🍞', calories: '200 kcal' },
    Almuerzo: { name: 'Salmón', image: '🐟', calories: '450 kcal' },
    Cena: { name: 'Tacos', image: '🌮', calories: '410 kcal' }
  },
  Miércoles: {
    Desayuno: { name: 'Batido', image: '🥤', calories: '180 kcal' },
    Almuerzo: { name: 'Bowl Buddha', image: '🥙', calories: '395 kcal' },
    Cena: { name: 'Pizza', image: '🍕', calories: '520 kcal' }
  },
  Jueves: {
    Desayuno: { name: 'Huevos', image: '🍳', calories: '220 kcal' },
    Almuerzo: null,
    Cena: { name: 'Bistec', image: '🥩', calories: '480 kcal' }
  },
  Viernes: {
    Desayuno: { name: 'Panqueques', image: '🥞', calories: '350 kcal' },
    Almuerzo: { name: 'Ensalada', image: '🥗', calories: '280 kcal' },
    Cena: null
  },
  Sábado: {
    Desayuno: { name: 'Waffles', image: '🧇', calories: '380 kcal' },
    Almuerzo: { name: 'Sopa', image: '🍲', calories: '240 kcal' },
    Cena: { name: 'BBQ', image: '🍖', calories: '550 kcal' }
  },
  Domingo: {
    Desayuno: { name: 'Bagel', image: '🥯', calories: '290 kcal' },
    Almuerzo: { name: 'Sándwich', image: '🥪', calories: '320 kcal' },
    Cena: { name: 'Pollo', image: '🍗', calories: '420 kcal' }
  }
};
