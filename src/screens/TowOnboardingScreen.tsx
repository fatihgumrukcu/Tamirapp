// src/screens/TowOnboardingScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import FadeSlideTransition from '../components/FadeSlideTransition';

const TowOnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/images/tow-bg.png')} // 📸 Arka plan resmi
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <FadeSlideTransition>
          <View style={styles.topSection}>
            <Text style={styles.title}>Yolda mı Kaldın?</Text>
            <Text style={styles.subtitle}>
                Tamirapp artık sadece tamirci ve parçacılarla sınırlı değil. Artık acil durumlarda konumuna en yakın çekici hizmetine saniyeler içinde ulaşabilirsin. 
                Uygulama senin için çevrendeki tüm güvenilir çekicileri harita üzerinden listeler ve tek dokunuşla iletişime geçmeni sağlar.
            </Text>

            <Text style={styles.subtitle}>
            Gece ya da gündüz fark etmeden, motosikletin seni yolda bıraktığında yardım hemen cebinde. 
            Güvenilir, hızlı ve profesyonel çekici hizmetleri artık cebinde.
            </Text>
          </View>
        </FadeSlideTransition>

        <FadeSlideTransition>
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace('FinalOnboarding')}

            >
              <Text style={styles.buttonText}>Devam Et</Text>
            </TouchableOpacity>
          </View>
        </FadeSlideTransition>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  topSection: { marginTop: 20 },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 16,
  },
  bottomSection: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff8200',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default TowOnboardingScreen;
