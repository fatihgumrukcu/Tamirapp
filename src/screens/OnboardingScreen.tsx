import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import FadeSlideTransition from '../components/FadeSlideTransition';

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/images/shoppinguser.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <FadeSlideTransition>
          <View style={styles.topSection}>
            <Text style={styles.title}>Tamirci mi Arıyorsun?</Text>
            <Text style={styles.subtitle}>
              Artık en yakın motosiklet tamircisini bulmak için sokak sokak gezmene gerek yok. TamirApp,
              konumuna en yakın servisleri harita üzerinde senin için listeler.
            </Text>
            <Text style={styles.subtitle}>
              Her tamirci hakkında detaylı bilgilere ulaşabilir, kullanıcı yorumlarını okuyabilir ve
              kararını güvenle verebilirsin.
            </Text>
            <Text style={styles.subtitle}>
              Dilersen tek dokunuşla yol tarifi alabilir ya da doğrudan arayarak iletişime geçebilirsin.
              Motosiklet sorunlarına hızlı ve etkili çözüm artık cebinde!
            </Text>
          </View>
        </FadeSlideTransition>

        <FadeSlideTransition>
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace('TowOnboarding')}>
              <Text style={styles.buttonText}>Devam Et</Text>
            </TouchableOpacity>
          </View>
        </FadeSlideTransition>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  topSection: {
    marginTop: 20,
  },
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

export default OnboardingScreen;
