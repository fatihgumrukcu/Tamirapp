import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const handleRateApp = () => {
    Linking.openURL('https://apps.apple.com/app/id000000000'); // 🔁 App Store linkini güncelle
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}> Ayarlar</Text>

      <TouchableOpacity style={styles.item} onPress={handleRateApp}>
        <Text style={styles.label}> Uygulamayı Puanla</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleContactSupport}>
        <Text style={styles.label}> Destek Al</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleClearData}>
        <Text style={[styles.label, { color: '#ff3b30' }]}> Tüm Verileri Temizle</Text>
      </TouchableOpacity>

      <Text style={styles.version}>TamirApp v1.0.0</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111',
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999',
  },
});

export default SettingsScreen;
