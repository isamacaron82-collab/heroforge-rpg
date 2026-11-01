import { RootState } from './index';
import { RPGItem } from './slices/inventorySlice';
import { PALETTE } from '../theme/colors';

// 1. Selector de ítems equipados completos (cruzando catálogo y equippedIds)
export const selectEquippedItems = (state: RootState): RPGItem[] => {
  const { catalog, equippedIds } = state.inventory;
  return catalog.filter((item) => equippedIds.includes(item.id));
};

// 2. Selector de Atributos Totales (Base + Bonos de Ítems Equipados)
export const selectTotalStats = (state: RootState) => {
  const { str, agi, int } = state.stats;
  const equippedItems = selectEquippedItems(state);

  const totalStr = str + equippedItems.reduce((acc, i) => acc + i.bonusStr, 0);
  const totalAgi = agi + equippedItems.reduce((acc, i) => acc + i.bonusAgi, 0);
  const totalInt = int + equippedItems.reduce((acc, i) => acc + i.bonusInt, 0);

  return { totalStr, totalAgi, totalInt };
};

// 3. Selector de Carga y Capacidad de Peso
export const selectWeightStatus = (state: RootState) => {
  const { totalStr } = selectTotalStats(state);
  const equippedItems = selectEquippedItems(state);

  const currentWeight = equippedItems.reduce((acc, i) => acc + i.weight, 0);
  const maxWeightCapacity = 10 + totalStr * 2;
  const isOverloaded = currentWeight > maxWeightCapacity;
  const weightPercentage = Math.min(100, Math.round((currentWeight / maxWeightCapacity) * 100));

  return {
    currentWeight,
    maxWeightCapacity,
    isOverloaded,
    weightPercentage,
  };
};

export const selectIsOverencumbered = (state: RootState): boolean => {
  return selectWeightStatus(state).isOverloaded;
};

export const selectTotalWeight = (state: RootState): number => {
  return selectWeightStatus(state).currentWeight;
};

// 4. Selector de Apariencia y Clase Visual
// Mapea exactamente cada preset o atributo dominante a su respectivo avatar
export const selectHeroVisualClass = (state: RootState) => {
  const { currentHp, selectedPreset } = state.stats;
  const { totalStr, totalAgi, totalInt } = selectTotalStats(state);
  const { currentWeight } = selectWeightStatus(state);

  let heroClass = 'Novato';
  let avatarKey: 'warrior' | 'mage' | 'rogue' | 'tank' | 'novice' = 'novice';
  let avatarTitle = 'Aventurero Novicio';
  let auraColor = PALETTE.almondSilk;

  if (currentHp <= 0) {
    heroClass = 'Derrotado (K.O.)';
    auraColor = PALETTE.borderMuted;
    avatarKey = 'novice';
    avatarTitle = 'Héroe Derrotado';
  } else if (selectedPreset === 'TANK') {
    // CUARTA FOTO: Personaje Militar con gorro verde
    heroClass = 'Tanque Pesado';
    auraColor = PALETTE.lobsterPink;
    avatarKey = 'tank';
    avatarTitle = 'Tanque Militar';
  } else if (selectedPreset === 'WARRIOR') {
    // PRIMERA FOTO: Casco de diamante y espada de Minecraft
    heroClass = 'Guerrera Feroz';
    auraColor = PALETTE.lobsterPink;
    avatarKey = 'warrior';
    avatarTitle = 'Berserker Implacable';
  } else if (selectedPreset === 'MAGE') {
    // SEGUNDA FOTO: Mago con túnica gritando
    heroClass = 'Archimago Arcano';
    auraColor = PALETTE.almondSilk;
    avatarKey = 'mage';
    avatarTitle = 'Hechicero Sabio';
  } else if (selectedPreset === 'ROGUE') {
    // TERCERA FOTO: Pícaro con pelo arrugado
    heroClass = 'Pícaro Sombrío';
    auraColor = PALETTE.linen;
    avatarKey = 'rogue';
    avatarTitle = 'Alquimista Furtivo';
  } else if (totalInt >= 15 && totalInt >= totalStr && totalInt >= totalAgi) {
    heroClass = 'Archimago Arcano';
    auraColor = PALETTE.almondSilk;
    avatarKey = 'mage';
    avatarTitle = 'Hechicero Sabio';
  } else if (totalAgi >= 15 && totalAgi >= totalStr && totalAgi >= totalInt) {
    heroClass = 'Pícaro Sombrío';
    auraColor = PALETTE.linen;
    avatarKey = 'rogue';
    avatarTitle = 'Alquimista Furtivo';
  } else if (totalStr >= 15) {
    if (currentWeight >= 8) {
      heroClass = 'Tanque Pesado';
      auraColor = PALETTE.lobsterPink;
      avatarKey = 'tank';
      avatarTitle = 'Tanque Militar';
    } else {
      heroClass = 'Guerrera Feroz';
      auraColor = PALETTE.lobsterPink;
      avatarKey = 'warrior';
      avatarTitle = 'Berserker Implacable';
    }
  }

  return { heroClass, auraColor, avatarKey, avatarTitle };
};

// 5. Selector de Poder de Combate (con penalización por sobrecarga del 30%)
export const selectCombatPower = (state: RootState) => {
  const { totalStr, totalAgi, totalInt } = selectTotalStats(state);
  const { isOverloaded } = selectWeightStatus(state);

  const rawPower = totalStr * 3 + totalAgi * 2 + totalInt * 3;
  const combatPower = isOverloaded ? Math.round(rawPower * 0.7) : rawPower;

  return {
    rawPower,
    combatPower,
    penaltyApplied: isOverloaded,
  };
};

// 6. Selector Compuesto Central
export const selectHeroComputedStatus = (state: RootState) => {
  const { str, agi, int, currentHp, maxHp, availablePoints } = state.stats;
  const { catalog, equippedIds } = state.inventory;
  const equippedItems = catalog.filter((item) => equippedIds.includes(item.id));

  const totalStr = str + equippedItems.reduce((acc, i) => acc + i.bonusStr, 0);
  const totalAgi = agi + equippedItems.reduce((acc, i) => acc + i.bonusAgi, 0);
  const totalInt = int + equippedItems.reduce((acc, i) => acc + i.bonusInt, 0);

  const currentWeight = equippedItems.reduce((acc, i) => acc + i.weight, 0);
  const maxWeightCapacity = 10 + totalStr * 2;
  const isOverloaded = currentWeight > maxWeightCapacity;
  const weightPercentage = Math.min(100, Math.round((currentWeight / maxWeightCapacity) * 100));

  const { heroClass, auraColor, avatarKey, avatarTitle } = selectHeroVisualClass(state);
  const { rawPower, combatPower } = selectCombatPower(state);

  return {
    str,
    agi,
    int,
    availablePoints,
    currentHp,
    maxHp,
    isDefeated: currentHp <= 0,
    totalStr,
    totalAgi,
    totalInt,
    currentWeight,
    maxWeightCapacity,
    isOverloaded,
    weightPercentage,
    heroClass,
    auraColor,
    avatarKey,
    avatarTitle,
    rawPower,
    combatPower,
    equippedItems,
  };
};
