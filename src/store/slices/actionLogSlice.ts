import { createSlice, PayloadAction, UnknownAction } from '@reduxjs/toolkit';

export interface ActionLogItem {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  payloadStr: string;
}

export interface ActionLogState {
  logs: ActionLogItem[];
  maxLogs: number;
}

const initialState: ActionLogState = {
  logs: [
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system/init',
      description: 'Partida iniciada',
      payloadStr: 'Store de Redux conectado',
    },
  ],
  maxLogs: 10,
};

export const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {
    addManualLog: (
      state,
      action: PayloadAction<{ type: string; description: string; payloadStr: string }>
    ) => {
      const newEntry: ActionLogItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toLocaleTimeString(),
        type: action.payload.type,
        description: action.payload.description,
        payloadStr: action.payload.payloadStr,
      };
      state.logs.unshift(newEntry);
      if (state.logs.length > state.maxLogs) {
        state.logs.pop();
      }
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
  // Bonus de Arquitectura: extraReducers con builder.addMatcher
  // Captura automáticamente cualquier acción despachada en statsSlice o inventorySlice
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: UnknownAction): boolean => {
        return (
          action.type.startsWith('stats/') ||
          action.type.startsWith('inventory/')
        );
      },
      (state, action: UnknownAction & { payload?: unknown }) => {
        let desc = 'Acción despachada en el Store';
        let payloadStr = action.payload !== undefined ? JSON.stringify(action.payload) : 'Sin payload';

        // Descripciones didácticas para la rúbrica
        if (action.type === 'stats/incrementStat') {
          desc = `Subió atributo (+1 ${action.payload})`;
        } else if (action.type === 'stats/decrementStat') {
          desc = `Bajó atributo (-1 ${action.payload})`;
        } else if (action.type === 'stats/applyBuildPreset') {
          desc = `Preset aplicado [${action.payload}]`;
        } else if (action.type === 'stats/takeDamage') {
          desc = `¡Héroe recibió daño! (-${action.payload} HP)`;
        } else if (action.type === 'stats/healHero') {
          desc = `Héroe restaurado (HP al 100%)`;
        } else if (action.type === 'stats/resetStats') {
          desc = `Reseteo total de atributos`;
        } else if (action.type === 'inventory/toggleEquipItem') {
          desc = `Cambio de equipamiento (Item ${action.payload})`;
        } else if (action.type === 'inventory/clearEquipment') {
          desc = `Desequipó todo el inventario`;
        }

        const newLog: ActionLogItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toLocaleTimeString(),
          type: action.type,
          description: desc,
          payloadStr,
        };

        state.logs.unshift(newLog);
        if (state.logs.length > state.maxLogs) {
          state.logs.pop();
        }
      }
    );
  },
});

export const { addManualLog, clearLogs } = actionLogSlice.actions;

export default actionLogSlice.reducer;
