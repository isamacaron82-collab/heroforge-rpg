import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { HeroAvatarHUD } from './src/components/HeroAvatarHUD';
import { StatsControlPanel } from './src/components/StatsControlPanel';
import { ArmoryGrid } from './src/components/ArmoryGrid';
import { ReduxLiveInspector } from './src/components/ReduxLiveInspector';
import { PALETTE } from './src/theme/colors';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        {/* Encabezado General (Paleta NYNÄ) */}
        <View style={styles.appHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>HEROFORGE RPG</Text>
            <Text style={styles.headerSubtitle}>
              ARQUITECTURA DE ESTADO GLOBAL • REDUX TOOLKIT
            </Text>
          </View>
          <View style={styles.versionChip}>
            <Text style={styles.versionChipText}>V1.0</Text>
          </View>
        </View>

        {/* Contenedor con las 4 Zonas Visuales Independientes */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ZONA A: Avatar & HUD Superior */}
          <HeroAvatarHUD />

          {/* ZONA B: Panel de Entrenamiento */}
          <StatsControlPanel />

          {/* ZONA C: Armería & Mochila */}
          <ArmoryGrid />

          {/* ZONA D: Arena de Combate contra Boss & Monitor Redux */}
          <ReduxLiveInspector />
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.midnightViolet,
  },
  appHeader: {
    backgroundColor: PALETTE.cardBg,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: PALETTE.borderNormal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 8.5,
    color: PALETTE.almondSilk,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  versionChip: {
    backgroundColor: PALETTE.cardInner,
    borderWidth: 1,
    borderColor: PALETTE.borderNormal,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  versionChipText: {
    fontSize: 9,
    fontWeight: '900',
    color: PALETTE.linen,
    fontFamily: 'monospace',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },
});
