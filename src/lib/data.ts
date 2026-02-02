import type { BananaWrapping, CacaoSale, BananaSale, FertilizerApplication } from './types';

export const TAPE_COLORS = [
  { value: 'rojo', label: 'Rojo' },
  { value: 'azul', label: 'Azul' },
  { value: 'verde', label: 'Verde' },
  { value: 'amarillo', label: 'Amarillo' },
  { value: 'naranja', label: 'Naranja' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'violeta', label: 'Violeta' },
  { value: 'blanco', label: 'Blanco' },
  { value: 'negro', label: 'Negro' },
  { value: 'gris', label: 'Gris' },
  { value: 'Plomo', label: 'Plomo' }
];

export const initialBananaWrappings: BananaWrapping[] = [
    //{ id: 'mock-bw-1', date: new Date(), color: 'rojo', quantity: 150, observation: 'Lote de la mañana.', sold: false },
    //{ id: 'mock-bw-2', date: new Date(Date.now() - 86400000), color: 'azul', quantity: 200, observation: 'Lote de ayer.', sold: true },
];
export const initialCacaoSales: CacaoSale[] = [
    //{ id: 'mock-cs-1', date: new Date(), quantity: 50, unitPrice: 2.5, totalValue: 125, description: 'Venta a granel.' },
];
export const initialBananaSales: BananaSale[] = [
    //{ id: 'mock-bs-1', date: new Date(), quantity: 80, tapeColors: ['azul'], unitPrice: 10, totalPrice: 800, wrappingIds: ['mock-bw-2'] },
];
export const initialFertilizerApplications: FertilizerApplication[] = [
    //{ id: 'mock-fa-1', date: new Date(), fertilizerType: 'urea', quantity: 20, notes: 'Aplicación post-lluvia.' },
];
