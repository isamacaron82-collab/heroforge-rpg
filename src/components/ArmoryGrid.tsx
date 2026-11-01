import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleEquipItem, clearEquipment, RPGItem } from '../store/slices/inventorySlice';
import { selectWeightStatus } from '../store/selectors';
import { ITEM_IMAGES } from '../assets/itemImages';
import { PALETTE } from '../theme/colors';

/**
 * ZONA C: Armería
 * Íconos de objetos grandes, paleta NYNÄ, sin emojis ni mención a "mochila".
 */
export const ArmoryGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const { catalog, equippedIds } = useAppSelector((state) => state.inventory);
  const { isOverloaded, currentWeight, maxWeightCapacity } = useAppSelector(selectWeightStatus);

  const renderPixelItem = (item: RPGItem) => {
    const isEquipped = equippedIds.includes(item.id);
    const itemImageSource = ITEM_IMAGES[item.imageKey];

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.itemCard,
          isEquipped && styles.itemCardEquipped,
        ]}
        onPress={() => dispatch(toggleEquipItem(item.id))}
        activeOpacity={0.7}
      >
        {/* Contenedor con Ícono Grande */}
        <View style={styles.imageHeader}>
          <View style={[styles.imageWrapper, isEquipped && styles.imageWrapperEquipped]}>
            <Image
              source={itemImageSource}
              style={styles.pixelItemImage}
              resizeMode="contain"
            />
          </View>
          {isEquipped && (
            <View style={styles.activeChip}>
              <Text style={styles.activeChipText}>ACTIVO</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemName} numberOfLines={1}>{item.name.toUpperCase()}</Text>
        <Text style={styles.itemCategory}>[{item.category.toUpperCase()}]</Text>

        {/* Stats del ítem */}
        <View style={styles.badgesRow}>
          {item.bonusStr !== 0 && (
            <Text style={[styles.statBadge, { color: PALETTE.lobsterPink }]}>
              {item.bonusStr > 0 ? `+${item.bonusStr}` : item.bonusStr} STR
            </Text>
          )}
          {item.bonusAgi !== 0 && (
            <Text style={[styles.statBadge, { color: PALETTE.almondSilk }]}>
              {item.bonusAgi > 0 ? `+${item.bonusAgi}` : item.bonusAgi} AGI
            </Text>
          )}
          {item.bonusInt !== 0 && (
            <Text style={[styles.statBadge, { color: PALETTE.linen }]}>
              {item.bonusInt > 0 ? `+${item.bonusInt}` : item.bonusInt} INT
            </Text>
          )}
        </View>

        {/* Peso del objeto */}
        <View style={styles.weightFooter}>
          <Text style={styles.weightText}>PESO: {item.weight} KG</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.zoneTag}>[ ZONA C ]</Text>
          <Text style={styles.zoneTitle}>ARMERÍA</Text>
        </View>
        {equippedIds.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => dispatch(clearEquipment())}
            activeOpacity={0.6}
          >
            <Text style={styles.clearBtnText}>QUITAR TODO ({equippedIds.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitle}>
        TOCA UN OBJETO PARA EQUIPAR O DESEQUIPAR:
      </Text>

      {/* Alerta Visual de Sobrecarga */}
      {isOverloaded && (
        <View style={styles.overloadBox}>
          <Text style={styles.overloadTag}>[!]</Text>
          <View style={styles.overloadTextContainer}>
            <Text style={styles.overloadTitle}>ALERTA: SOBRECARGA ACTIVA</Text>
            <Text style={styles.overloadDesc}>
              Límite excedido ({currentWeight}/{maxWeightCapacity} Kg). Penalización:
              -50% Velocidad, -30% Poder.
            </Text>
          </View>
        </View>
      )}

      {/* Cuadrícula de ítems */}
      <View style={styles.grid}>
        {catalog.map((item) => renderPixelItem(item))}
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
  clearBtn: {
    backgroundColor: PALETTE.winePlum,
    borderWidth: 1.5,
    borderColor: PALETTE.lobsterPink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  clearBtnText: {
    fontSize: 9,
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
  overloadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.winePlum,
    borderWidth: 1.5,
    borderColor: PALETTE.lobsterPink,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  overloadTag: {
    fontSize: 14,
    fontWeight: '900',
    color: PALETTE.lobsterPink,
    fontFamily: 'monospace',
    marginRight: 8,
  },
  overloadTextContainer: {
    flex: 1,
  },
  overloadTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  overloadDesc: {
    fontSize: 9,
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemCard: {
    width: '48%',
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1.5,
    borderColor: PALETTE.borderNormal,
    borderRadius: 6,
    padding: 10,
  },
  itemCardEquipped: {
    borderColor: PALETTE.lobsterPink,
    backgroundColor: PALETTE.winePlum,
  },
  imageHeader: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  imageWrapper: {
    width: 74,
    height: 74,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: PALETTE.borderNormal,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    overflow: 'hidden',
  },
  imageWrapperEquipped: {
    borderColor: PALETTE.lobsterPink,
    borderWidth: 2,
  },
  pixelItemImage: {
    width: '100%',
    height: '100%',
  },
  activeChip: {
    position: 'absolute',
    top: -4,
    right: 4,
    backgroundColor: PALETTE.lobsterPink,
    borderWidth: 1,
    borderColor: PALETTE.linen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  activeChipText: {
    fontSize: 8,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  itemName: {
    fontSize: 10.5,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
    marginBottom: 1,
  },
  itemCategory: {
    fontSize: 8.5,
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  statBadge: {
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'monospace',
    backgroundColor: PALETTE.cardBg,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  weightFooter: {
    borderTopWidth: 1,
    borderTopColor: PALETTE.borderNormal,
    paddingTop: 4,
  },
  weightText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: PALETTE.almondSilk,
    fontFamily: 'monospace',
  },
});
