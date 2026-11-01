import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  incrementStat,
  decrementStat,
  applyBuildPreset,
  resetStats,
} from '../store/slices/statsSlice';
import { selectTotalStats } from '../store/selectors';
import { PALETTE } from '../theme/colors';

/**
 * ZONA B: Panel de Entrenamiento (Atributos)
 * Cero emojis. Paleta unificada NYNÄ.
 */
export const StatsControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { availablePoints, str, agi, int } = useAppSelector((state) => state.stats);
  const { totalStr, totalAgi, totalInt } = useAppSelector(selectTotalStats);

  const renderStatRow = (
    label: string,
    key: 'str' | 'agi' | 'int',
    baseValue: number,
    totalValue: number,
    statColor: string
  ) => {
    const bonus = totalValue - baseValue;
    const canDecrement = baseValue > 1;
    const canIncrement = availablePoints > 0;

    return (
      <View key={key} style={styles.statRow}>
        <View style={styles.statLeft}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statSub}>
            Base: {baseValue} {bonus > 0 ? `(+${bonus} Ítem)` : ''}
          </Text>
        </View>

        {/* Valor Total Numérico */}
        <View style={[styles.statValueBox, { borderColor: statColor }]}>
          <Text style={[styles.statValueText, { color: statColor }]}>
            {totalValue < 10 ? `0${totalValue}` : totalValue}
          </Text>
        </View>

        {/* Botones [-] y [+] */}
        <View style={styles.buttonsGroup}>
          <TouchableOpacity
            style={[styles.btn, !canDecrement && styles.btnDisabled]}
            disabled={!canDecrement}
            onPress={() => dispatch(decrementStat(key))}
            activeOpacity={0.6}
          >
            <Text style={[styles.btnText, !canDecrement && styles.btnTextDisabled]}>
              −
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              styles.btnPlus,
              !canIncrement && styles.btnDisabled,
            ]}
            disabled={!canIncrement}
            onPress={() => dispatch(incrementStat(key))}
            activeOpacity={0.6}
          >
            <Text
              style={[
                styles.btnText,
                styles.btnPlusText,
                !canIncrement && styles.btnTextDisabled,
              ]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.zoneTag}>[ ZONA B ]</Text>
          <Text style={styles.zoneTitle}>ENTRENAMIENTO</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>
            {availablePoints} PTS DISP.
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        DISTRIBUYE TUS PUNTOS EN LOS ATRIBUTOS PRIMARIOS:
      </Text>

      {/* Lista de Atributos (Sin emojis) */}
      <View style={styles.statsContainer}>
        {renderStatRow('FUERZA (STR)', 'str', str, totalStr, PALETTE.lobsterPink)}
        {renderStatRow('AGILIDAD (AGI)', 'agi', agi, totalAgi, PALETTE.almondSilk)}
        {renderStatRow('INTELIGENCIA (INT)', 'int', int, totalInt, PALETTE.linen)}
      </View>

      {/* Presets Rápidos (Sin emojis) */}
      <Text style={styles.presetsHeader}>PRESETS RÁPIDOS DE CLASE (1 DISPATCH):</Text>
      <View style={styles.presetsGrid}>
        <TouchableOpacity
          style={[styles.presetCard, { borderColor: PALETTE.lobsterPink }]}
          onPress={() => dispatch(applyBuildPreset('WARRIOR'))}
          activeOpacity={0.6}
        >
          <Text style={styles.presetText}>GUERRERO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetCard, { borderColor: PALETTE.almondSilk }]}
          onPress={() => dispatch(applyBuildPreset('MAGE'))}
          activeOpacity={0.6}
        >
          <Text style={styles.presetText}>MAGO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetCard, { borderColor: PALETTE.linen }]}
          onPress={() => dispatch(applyBuildPreset('ROGUE'))}
          activeOpacity={0.6}
        >
          <Text style={styles.presetText}>PÍCARO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetCard, { borderColor: PALETTE.winePlum }]}
          onPress={() => dispatch(applyBuildPreset('TANK'))}
          activeOpacity={0.6}
        >
          <Text style={styles.presetText}>TANQUE</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Reseteo */}
      <TouchableOpacity
        style={styles.resetBtn}
        onPress={() => dispatch(resetStats())}
        activeOpacity={0.6}
      >
        <Text style={styles.resetBtnText}>[ RESTABLECER PUNTOS DE ATRIBUTOS ]</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PALETTE.borderNormal,
    padding: 14,
    marginBottom: 16,
    shadowColor: PALETTE.winePlum,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: PALETTE.borderNormal,
    paddingBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  zoneTag: {
    fontSize: 10,
    fontWeight: '900',
    color: PALETTE.lobsterPink,
    fontFamily: 'monospace',
    backgroundColor: PALETTE.cardInner,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
  },
  zoneTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: PALETTE.linen,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  pointsBadge: {
    backgroundColor: PALETTE.lobsterPink,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pointsBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 10,
    color: PALETTE.textSecondary,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  statsContainer: {
    gap: 8,
    marginBottom: 14,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1.5,
    borderColor: PALETTE.borderNormal,
    borderRadius: 4,
    padding: 8,
  },
  statLeft: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  statSub: {
    fontSize: 9,
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
  },
  statValueBox: {
    backgroundColor: PALETTE.cardBg,
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginHorizontal: 8,
  },
  statValueText: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  buttonsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  btn: {
    width: 32,
    height: 32,
    backgroundColor: PALETTE.winePlum,
    borderWidth: 1.5,
    borderColor: PALETTE.almondSilk,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPlus: {
    backgroundColor: PALETTE.lobsterPink,
    borderColor: PALETTE.linen,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: PALETTE.linen,
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  btnPlusText: {
    color: PALETTE.linen,
  },
  btnTextDisabled: {
    color: PALETTE.textMuted,
  },
  presetsHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  presetsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  presetCard: {
    flex: 1,
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1.5,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 9,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  resetBtn: {
    backgroundColor: PALETTE.winePlum,
    borderWidth: 1.5,
    borderColor: PALETTE.borderNormal,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetBtnText: {
    color: PALETTE.linen,
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
});
