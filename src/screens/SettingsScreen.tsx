// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  useColorScheme,
  Switch,
  View,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [aboutVisible, setAboutVisible] = useState(false);

  const handleRateApp = () => {
    Linking.openURL('https://apps.apple.com/app/id000000000');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@tamirapp.com');
  };

  const handleClearData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Başarılı', 'Tüm veriler temizlendi.');
    } catch (error) {
      Alert.alert('Hata', 'Veriler silinemedi.');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, isDarkMode && { color: '#fff' }]}>Ayarlar</Text>

        <TouchableOpacity style={styles.item} onPress={handleRateApp}>
          <Text style={[styles.label, isDarkMode && { color: '#eee' }]}>Uygulamayı Puanla</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleContactSupport}>
          <Text style={[styles.label, isDarkMode && { color: '#eee' }]}>Destek Al</Text>
        </TouchableOpacity>

        <View style={styles.itemRow}>
          <Text style={[styles.label, isDarkMode && { color: '#eee' }]}>Karanlık Mod</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#ccc', true: '#ff8200' }}
            thumbColor={isDarkMode ? '#ff8200' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.item} onPress={handleClearData}>
          <Text style={[styles.label, styles.dangerText]}>Tüm Verileri Temizle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => setAboutVisible(true)}>
          <Text style={[styles.label, isDarkMode && { color: '#eee' }]}>Hakkımızda</Text>
        </TouchableOpacity>

        <Text style={[styles.version, isDarkMode && { color: '#666' }]}>TamirApp v1.0.0</Text>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutVisible}
        onRequestClose={() => setAboutVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setAboutVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hakkımızda</Text>
            <Text style={styles.modalText}>
              TamirApp, en yakın motosiklet tamircilerini ve yedek parça satıcılarını kolayca bulmanızı sağlayan modern bir uygulamadır.\n\nTamirApp ile tamir işleri artık daha kolay.
            </Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 60 },
  header: { fontSize: 24, fontFamily: 'Montserrat-Bold', marginBottom: 24, color: '#111' },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#333',
  },
  dangerText: { color: '#ff3b30' },
  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999',
    fontFamily: 'Montserrat-Light',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 12,
    color: '#111',
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#444',
    lineHeight: 22,
  },
});

export default SettingsScreen;
