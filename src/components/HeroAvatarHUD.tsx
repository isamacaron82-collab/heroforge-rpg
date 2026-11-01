import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAppSelector } from '../store';
import { selectHeroComputedStatus } from '../store/selectors';
import { ITEM_IMAGES } from '../assets/itemImages';
import { AVATAR_IMAGES } from '../assets/avatarImages';
import { PALETTE } from '../theme/colors';

/**
 * ZONA A: Avatar & HUD Superior
 * Avatares grandes, centrados y limpios sin bordes o líneas extrañas.
 */
export const HeroAvatarHUD: React.FC = () => {
  const status = useAppSelector(selectHeroComputedStatus);

  const hpPercent = Math.max(0, Math.min(100, Math.round((status.currentHp / status.maxHp) * 100)));
  const hpBarColor =
    hpPercent > 50 ? PALETTE.lobsterPink : hpPercent > 25 ? PALETTE.almondSilk : '#991b1b';

  const weightBarColor = status.isOverloaded
    ? PALETTE.lobsterPink
    : status.weightPercentage > 75
    ? PALETTE.almondSilk
    : PALETTE.borderNormal;

  const expressionBadge =
    status.currentHp <= 0 ? '[K.O.]' : status.currentHp < 40 ? '[HERIDO]' : '[VITAL]';

  const avatarSource = AVATAR_IMAGES[status.avatarKey] || AVATAR_IMAGES.novice;

  return (
    <View style={styles.cardContainer}>
      {/* Título de Zona */}
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.zoneTag}>[ ZONA A ]</Text>
          <Text style={styles.zoneTitle}>HUD & AVATAR DEL HÉROE</Text>
        </View>
        <View style={[styles.statusTag, { borderColor: status.auraColor }]}>
          <Text style={[styles.statusTagText, { color: status.auraColor }]}>
            {expressionBadge}
          </Text>
        </View>
      </View>

      {/* Frame del Avatar Grande y Datos */}
      <View style={styles.avatarRow}>
        {/* Marco Grande con Fondo Blanco Limpio para que la ilustración destaque */}
        <View
          style={[
            styles.avatarBox,
            {
              borderColor: status.auraColor,
              shadowColor: status.auraColor,
            },
          ]}
        >
          <Image
            source={avatarSource}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          {status.isOverloaded && (
            <View style={styles.overloadIndicator}>
              <Text style={styles.overloadIndicatorText}>!</Text>
            </View>
          )}
        </View>

        {/* Información de Identidad */}
        <View style={styles.identityContainer}>
          <View style={[styles.classChip, { borderColor: status.auraColor }]}>
            <Text style={[styles.classChipText, { color: status.auraColor }]}>
              {status.heroClass.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.heroNameText}>{status.avatarTitle}</Text>

          {/* Mini inventario en mano */}
          <View style={styles.equippedBox}>
            <Text style={styles.equippedLabel}>EN MANO:</Text>
            <View style={styles.iconsRow}>
              {status.equippedItems.length === 0 ? (
                <Text style={styles.noItemsText}>[ Sin equipamiento ]</Text>
              ) : (
                status.equippedItems.map((item) => (
                  <View key={item.id} style={styles.miniItemBox}>
                    <Image
                      source={ITEM_IMAGES[item.imageKey]}
                      style={styles.miniItemImage}
                      resizeMode="contain"
                    />
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Barras de Estado */}
      <View style={styles.barsContainer}>
        {/* Barra 1: Vida (HP) */}
        <View style={styles.barBlock}>
          <View style={styles.barTextRow}>
            <Text style={styles.barLabel}>HP (SALUD)</Text>
            <Text style={styles.barNumbers}>
              {status.currentHp} / {status.maxHp}
            </Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${hpPercent}%`, backgroundColor: hpBarColor },
              ]}
            />
          </View>
        </View>

        {/* Barra 2: Maná (MP) */}
        <View style={styles.barBlock}>
          <View style={styles.barTextRow}>
            <Text style={styles.barLabel}>MP (ENERGÍA)</Text>
            <Text style={styles.barNumbers}>{status.totalInt * 10} MP</Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.min(100, Math.max(15, status.totalInt * 4))}%`,
                  backgroundColor: PALETTE.almondSilk,
                },
              ]}
            />
          </View>
        </View>

        {/* Barra 3: Carga de Peso */}
        <View style={styles.barBlock}>
          <View style={styles.barTextRow}>
            <Text style={styles.barLabel}>
              CARGA {status.isOverloaded ? '[SOBRECARGADO]' : ''}
            </Text>
            <Text
              style={[
                styles.barNumbers,
                status.isOverloaded && { color: PALETTE.lobsterPink, fontWeight: 'bold' },
              ]}
            >
              {status.currentWeight} / {status.maxWeightCapacity} Kg
            </Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.min(100, status.weightPercentage)}%`,
                  backgroundColor: weightBarColor,
                },
              ]}
            />
          </View>
        </View>
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
  statusTag: {
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: PALETTE.cardInner,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarBox: {
    width: 115,
    height: 115,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  overloadIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: PALETTE.lobsterPink,
    borderWidth: 1.5,
    borderColor: PALETTE.linen,
    borderRadius: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overloadIndicatorText: {
    fontSize: 12,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  identityContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  classChip: {
    alignSelf: 'flex-start',
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  classChipText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  heroNameText: {
    fontSize: 14,
    fontWeight: '900',
    color: PALETTE.linen,
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  equippedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  equippedLabel: {
    fontSize: 10,
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
    fontWeight: '700',
    marginRight: 6,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniItemBox: {
    width: 26,
    height: 26,
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  miniItemImage: {
    width: '100%',
    height: '100%',
  },
  noItemsText: {
    fontSize: 10,
    color: PALETTE.textMuted,
    fontStyle: 'italic',
    fontFamily: 'monospace',
  },
  barsContainer: {
    gap: 8,
  },
  barBlock: {
    marginBottom: 2,
  },
  barTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
  },
  barNumbers: {
    fontSize: 10,
    fontWeight: '700',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  track: {
    height: 9,
    backgroundColor: PALETTE.cardInner,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
