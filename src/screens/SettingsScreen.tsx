// src/screens/SettingsScreen.tsx
import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { Modalize } from 'react-native-modalize';

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const modalRef = useRef<Modalize>(null);

  const handleRateApp = () => {
    Linking.openURL('https://apps.apple.com/tr/app/tamirapp/id6744161686?l=tr');
  };
  

  const handleContactSupport = () => {
    Linking.openURL('mailto:Tamirapp@yandex.com');
  };

  const handleClearData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Başarılı', 'Tüm veriler temizlendi.');
    } catch (error) {
      Alert.alert('Hata', 'Veriler silinemedi.');
    }
  };

  const openAbout = () => {
    modalRef.current?.open();
  };

  return (
    <>
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
              onValueChange={toggleTheme}
              trackColor={{ false: '#ccc', true: '#ff8200' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.item} onPress={handleClearData}>
            <Text style={[styles.label, styles.dangerText]}>Tüm Verileri Temizle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={openAbout}>
            <Text style={[styles.label, isDarkMode && { color: '#eee' }]}>Hakkımızda</Text>
          </TouchableOpacity>

          <Text style={[styles.version, isDarkMode && { color: '#666' }]}>Tamirapp v1.2</Text>
        </ScrollView>
      </SafeAreaView>

      {/* Modalize ile Hakkımızda */}
      <Modalize
        ref={modalRef}
        adjustToContentHeight={true}
        handleStyle={{ backgroundColor: '#ccc' }}
        modalStyle={[
          styles.modal,
          isDarkMode && { backgroundColor: '#111' },
        ]}
        scrollViewProps={{
          contentContainerStyle: styles.modalContent,
        }}
      >
        <Text style={[styles.modalTitle, isDarkMode && { color: '#fff' }]}>Hakkımızda</Text>
        <Text style={[styles.modalText, isDarkMode && { color: '#ccc' }]}>
          TamirApp, motosiklet kullanıcılarının en hızlı şekilde tamirci ve yedek parça bulmasını
          sağlamak amacıyla geliştirilmiş modern bir uygulamadır. Konum tabanlı yapısıyla size en yakın
          hizmet noktalarını listeler.

          {"\n\n"}Amacımız; güvenilir, hızlı ve kullanıcı dostu bir deneyim sunmak. Uygulamamızda harita
          üzerinden tamircileri inceleyebilir, yorumlara göz atabilir ve yol tarifi alabilirsiniz.

          {"\n\n"}Geliştirme sürecinde kullanıcı ihtiyaçlarını temel aldık. Sizden gelen geri bildirimlerle
          TamirApp’i sürekli geliştiriyoruz.
        </Text>

        <TouchableOpacity style={styles.closeButton} onPress={() => modalRef.current?.close()}>
          <Text style={styles.closeButtonText}>Kapat</Text>
        </TouchableOpacity>
      </Modalize>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 60 },
  header: { fontSize: 24, fontFamily: 'Montserrat-Bold', marginBottom: 24 },
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
  },
  dangerText: { color: '#ff3b30' },
  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999',
    fontFamily: 'Montserrat-Light',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  modalContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 30,
    backgroundColor: '#ff8200',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
});

export default SettingsScreen;
