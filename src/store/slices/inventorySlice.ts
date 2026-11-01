import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RPGItem {
  id: string;
  name: string;
  imageKey: 'shield' | 'sword' | 'orb' | 'potion' | 'book' | 'hourglass';
  category: 'Escudo' | 'Arma' | 'Báculo' | 'Poción' | 'Libro Mágico' | 'Reliquia';
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  weight: number; // en Kg
  description: string;
}

export interface InventoryState {
  catalog: RPGItem[];
  equippedIds: string[];
}

const initialCatalog: RPGItem[] = [
  {
    id: 'item-shield',
    name: 'Escudo Angelical',
    imageKey: 'shield',
    category: 'Escudo',
    bonusStr: 6,
    bonusAgi: 0,
    bonusInt: 2,
    weight: 12,
    description: 'Escudo con alas celestiales y gema de corazón protector.',
  },
  {
    id: 'item-sword',
    name: 'Espada de la Luz',
    imageKey: 'sword',
    category: 'Arma',
    bonusStr: 8,
    bonusAgi: 3,
    bonusInt: 1,
    weight: 6,
    description: 'Hoja sagrada forjada con un zafiro astral brillante.',
  },
  {
    id: 'item-orb',
    name: 'Báculo Astral',
    imageKey: 'orb',
    category: 'Báculo',
    bonusStr: 0,
    bonusAgi: 1,
    bonusInt: 10,
    weight: 4,
    description: 'Esfera de cristal mística que canaliza energías estelares.',
  },
  {
    id: 'item-potion',
    name: 'Poción de Elixir Rosa',
    imageKey: 'potion',
    category: 'Poción',
    bonusStr: 1,
    bonusAgi: 7,
    bonusInt: 4,
    weight: 2,
    description: 'Frasco de alquimia que concede agilidad supersónica.',
  },
  {
    id: 'item-book',
    name: 'Libro Mágico Arcano',
    imageKey: 'book',
    category: 'Libro Mágico',
    bonusStr: 3,
    bonusAgi: 0,
    bonusInt: 12,
    weight: 10,
    description: 'Grimorio encuadernado en púrpura con hechizos antiguos.',
  },
  {
    id: 'item-hourglass',
    name: 'Reloj del Tiempo',
    imageKey: 'hourglass',
    category: 'Reliquia',
    bonusStr: 1,
    bonusAgi: 10,
    bonusInt: 3,
    weight: 3,
    description: 'Reloj de arena eterno que distorsiona el flujo temporal.',
  },
];


const initialState: InventoryState = {
  catalog: initialCatalog,
  equippedIds: [],
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleEquipItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.equippedIds.indexOf(itemId);
      if (index >= 0) {
        state.equippedIds.splice(index, 1);
      } else {
        state.equippedIds.push(itemId);
      }
    },
    clearEquipment: (state) => {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment } = inventorySlice.actions;

export default inventorySlice.reducer;
