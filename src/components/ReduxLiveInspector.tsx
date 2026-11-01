import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { takeDamage, healHero } from '../store/slices/statsSlice';
import { clearLogs, addManualLog } from '../store/slices/actionLogSlice';
import { selectCombatPower } from '../store/selectors';
import { PALETTE } from '../theme/colors';

/**
 * ZONA D: Arena de Combate contra el Dragón del Abismo & Inspector Redux en Vivo
 */
export const ReduxLiveInspector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentHp } = useAppSelector((state) => state.stats);
  const { logs } = useAppSelector((state) => state.actionLog);
  const { combatPower, penaltyApplied } = useAppSelector(selectCombatPower);

  const [bossHp, setBossHp] = useState<number>(300);
  const maxBossHp = 300;
  const [combatOutcome, setCombatOutcome] = useState<string>('El Dragón acecha desde las profundidades...');

  const handleAttackBoss = () => {
    if (currentHp <= 0) {
      setCombatOutcome('HÉROE DERROTADO. ¡Cúrate antes de atacar!');
      return;
    }

    if (bossHp <= 0) {
      setCombatOutcome('DRAGÓN DERROTADO. ¡Has conquistado el abismo!');
      return;
    }

    const heroDamage = Math.max(10, Math.round(combatPower / 2));
    const nextBossHp = Math.max(0, bossHp - heroDamage);
    setBossHp(nextBossHp);

    const bossCounterDamage = 20;
    dispatch(takeDamage(bossCounterDamage));

    dispatch(
      addManualLog({
        type: 'combat/attackRound',
        description: `Daño al Dragón: -${heroDamage} HP | Llamarada recibida: -${bossCounterDamage} HP`,
        payloadStr: JSON.stringify({ heroDamage, bossCounterDamage }),
      })
    );

    if (nextBossHp <= 0) {
      setCombatOutcome('¡VICTORIA ÉPICA! El Dragón del Abismo ha caído.');
    } else {
      setCombatOutcome(
        `GOLPE ACERTADO: -${heroDamage} HP al Dragón. El Dragón contraatacó con llamarada (-${bossCounterDamage} HP).`
      );
    }
  };

  const handleResetBoss = () => {
    setBossHp(maxBossHp);
    setCombatOutcome('El Dragón ha renacido con 300 HP.');
  };

  const bossHpPercent = Math.max(0, Math.min(100, Math.round((bossHp / maxBossHp) * 100)));

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.zoneTag}>[ ZONA D ]</Text>
          <Text style={styles.zoneTitle}>ARENA DE COMBATE & INSPECTOR REDUX</Text>
        </View>
      </View>

      {/* --- SECCIÓN 1: COMBATE CONTRA EL DRAGÓN DEL ABISMO --- */}
      <View style={styles.dragonBattleCard}>
        {/* Ilustración Grande del Dragón del Abismo */}
        <View style={styles.dragonVisualRow}>
          <View style={styles.dragonImageWrapper}>
            <Image
              source={require('../../assets/dragon.png')}
              style={styles.dragonImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.dragonMeta}>
            <Text style={styles.dragonName}>DRAGÓN DEL ABISMO</Text>
            <Text style={styles.dragonSub}>BESTIA ANCESTRAL DE SOMBRAS</Text>
            <View style={styles.dragonStatusTag}>
              <Text style={styles.dragonStatusText}>
                {bossHp > 0 ? 'ESTADO: EN COMBATE' : 'ESTADO: DERROTADO'}
              </Text>
            </View>
          </View>
        </View>

        {/* BARRA DE VIDA DEL DRAGÓN ESTILO JEFE RPG */}
        <View style={styles.bossHealthSection}>
          <View style={styles.bossHealthHeader}>
            <Text style={styles.bossHealthTitle}>VIDA DEL DRAGÓN</Text>
            <Text style={styles.bossHealthNumbers}>
              {bossHp} / {maxBossHp} HP ({bossHpPercent}%)
            </Text>
          </View>
          <View style={styles.dragonHpTrack}>
            <View
              style={[
                styles.dragonHpFill,
                {
                  width: `${bossHpPercent}%`,
                  backgroundColor: PALETTE.lobsterPink,
                },
              ]}
            />
          </View>
        </View>

        {/* Poder de Combate del Héroe */}
        <View style={styles.heroPowerRow}>
          <Text style={styles.heroPowerLabel}>
            PODER DE ATAQUE: <Text style={styles.heroPowerValue}>{combatPower} PTS</Text>
          </Text>
          {penaltyApplied && (
            <Text style={styles.penaltyAlert}>[-30% PENALIZACIÓN POR PESO]</Text>
          )}
        </View>

        <Text style={styles.outcomeMessage}>{combatOutcome}</Text>

        {/* Botones de Acción */}
        <View style={styles.combatButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.attackBtn, (currentHp <= 0 || bossHp <= 0) && styles.btnDisabled]}
            onPress={handleAttackBoss}
            activeOpacity={0.6}
          >
            <Text style={styles.btnText}>ATACAR AL DRAGÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.healBtn]}
            onPress={() => dispatch(healHero())}
            activeOpacity={0.6}
          >
            <Text style={styles.btnText}>CURAR HP</Text>
          </TouchableOpacity>

          {bossHp <= 0 && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.resetBossBtn]}
              onPress={handleResetBoss}
              activeOpacity={0.6}
            >
              <Text style={styles.btnText}>REVIVIR DRAGÓN</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* --- SECCIÓN 2: CONSOLA / MONITOR REDUX EN VIVO --- */}
      <View style={styles.consoleBox}>
        <View style={styles.consoleTop}>
          <Text style={styles.consoleTitle}>MONITOR REDUX (FEED EN VIVO)</Text>
          <TouchableOpacity onPress={() => dispatch(clearLogs())}>
            <Text style={styles.clearLogsLink}>[ LIMPIAR ]</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.consoleHint}>
          FLUJO: ACTION ➔ REDUCER ➔ STORE ➔ SELECTOR
        </Text>

        <ScrollView style={styles.logsScroll} nestedScrollEnabled={true}>
          {logs.length === 0 ? (
            <Text style={styles.noLogsMessage}>[ SIN EVENTOS REGISTRADOS ]</Text>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logBox}>
                <View style={styles.logHeaderLine}>
                  <Text style={styles.logType}>{log.type}</Text>
                  <Text style={styles.logTime}>{log.timestamp}</Text>
                </View>
                <Text style={styles.logDesc}>{log.description}</Text>
                <Text style={styles.logPayload}>
                  <Text style={styles.payloadTag}>Payload:</Text> {log.payloadStr}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
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
    marginBottom: 24,
    shadowColor: PALETTE.winePlum,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 4,
  },
  headerRow: {
    marginBottom: 12,
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
  dragonBattleCard: {
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1.5,
    borderColor: PALETTE.borderNormal,
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  dragonVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dragonImageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PALETTE.borderNormal,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  dragonImage: {
    width: '100%',
    height: '100%',
  },
  dragonMeta: {
    flex: 1,
    marginLeft: 12,
  },
  dragonName: {
    fontSize: 13,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  dragonSub: {
    fontSize: 8.5,
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
    marginTop: 2,
    marginBottom: 6,
  },
  dragonStatusTag: {
    alignSelf: 'flex-start',
    backgroundColor: PALETTE.cardBg,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dragonStatusText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
  },
  bossHealthSection: {
    marginBottom: 10,
    backgroundColor: PALETTE.cardBg,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
  },
  bossHealthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bossHealthTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  bossHealthNumbers: {
    fontSize: 9.5,
    fontWeight: '900',
    color: PALETTE.lobsterPink,
    fontFamily: 'monospace',
  },
  dragonHpTrack: {
    height: 12,
    backgroundColor: PALETTE.cardInner,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
    overflow: 'hidden',
  },
  dragonHpFill: {
    height: '100%',
  },
  heroPowerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroPowerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  heroPowerValue: {
    color: PALETTE.lobsterPink,
    fontWeight: '900',
  },
  penaltyAlert: {
    fontSize: 9,
    color: PALETTE.lobsterPink,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  outcomeMessage: {
    fontSize: 9.5,
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
    marginBottom: 10,
    minHeight: 24,
  },
  combatButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  attackBtn: {
    backgroundColor: PALETTE.lobsterPink,
    borderColor: PALETTE.linen,
  },
  healBtn: {
    backgroundColor: PALETTE.winePlum,
    borderColor: PALETTE.almondSilk,
  },
  resetBossBtn: {
    backgroundColor: PALETTE.cardBg,
    borderColor: PALETTE.borderNormal,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: PALETTE.linen,
    fontSize: 9.5,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  consoleBox: {
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1.5,
    borderColor: PALETTE.borderNormal,
    borderRadius: 4,
    padding: 10,
  },
  consoleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  consoleTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  clearLogsLink: {
    fontSize: 10,
    color: PALETTE.almondSilk,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  consoleHint: {
    fontSize: 9,
    color: PALETTE.textMuted,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  logsScroll: {
    maxHeight: 180,
  },
  noLogsMessage: {
    fontSize: 10,
    color: PALETTE.textMuted,
    fontFamily: 'monospace',
    textAlign: 'center',
    paddingVertical: 10,
  },
  logBox: {
    backgroundColor: PALETTE.cardBg,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.lobsterPink,
    borderRadius: 3,
    padding: 6,
    marginBottom: 6,
  },
  logHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  logType: {
    fontSize: 9,
    fontWeight: '900',
    color: PALETTE.lobsterPink,
    fontFamily: 'monospace',
  },
  logTime: {
    fontSize: 8,
    color: PALETTE.textMuted,
    fontFamily: 'monospace',
  },
  logDesc: {
    fontSize: 9,
    fontWeight: '800',
    color: PALETTE.linen,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  logPayload: {
    fontSize: 8,
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
  },
  payloadTag: {
    color: PALETTE.linen,
  },
});
