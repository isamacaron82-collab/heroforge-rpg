import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
  maxHp: number;
  selectedPreset: 'WARRIOR' | 'MAGE' | 'ROGUE' | 'TANK' | null;
}

const initialState: StatsState = {
  availablePoints: 15,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: 100,
  maxHp: 100,
  selectedPreset: null,
};

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat: (state, action: PayloadAction<'str' | 'agi' | 'int'>) => {
      if (state.availablePoints > 0) {
        state.availablePoints -= 1;
        state[action.payload] += 1;
        state.selectedPreset = null;
      }
    },
    decrementStat: (state, action: PayloadAction<'str' | 'agi' | 'int'>) => {
      if (state[action.payload] > 1) {
        state[action.payload] -= 1;
        state.availablePoints += 1;
        state.selectedPreset = null;
      }
    },
    takeDamage: (state, action: PayloadAction<number>) => {
      state.currentHp = Math.max(0, state.currentHp - action.payload);
    },
    healHero: (state) => {
      state.currentHp = state.maxHp;
    },
    applyBuildPreset: (state, action: PayloadAction<'WARRIOR' | 'MAGE' | 'ROGUE' | 'TANK'>) => {
      state.selectedPreset = action.payload;
      switch (action.payload) {
        case 'WARRIOR':
          state.str = 20;
          state.agi = 6;
          state.int = 4;
          state.availablePoints = 0;
          break;
        case 'MAGE':
          state.str = 3;
          state.agi = 7;
          state.int = 20;
          state.availablePoints = 0;
          break;
        case 'ROGUE':
          state.str = 5;
          state.agi = 21;
          state.int = 4;
          state.availablePoints = 0;
          break;
        case 'TANK':
          state.str = 18;
          state.agi = 4;
          state.int = 8;
          state.availablePoints = 0;
          break;
      }
    },
    resetStats: (state) => {
      state.availablePoints = 15;
      state.str = 5;
      state.agi = 5;
      state.int = 5;
      state.currentHp = 100;
      state.selectedPreset = null;
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;

export default statsSlice.reducer;
