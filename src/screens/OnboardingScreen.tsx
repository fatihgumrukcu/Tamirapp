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

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/images/Onboarding.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Neye İhtiyacın Var?</Text>
          <Text style={styles.subtitle}>TamirApp ile en yakın tamircileri harita üzerinden gör, iletişime geç veya doğrudan yol tarifi al.</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('FinalOnboarding')}
          >
            <Text style={styles.buttonText}>Devam Et</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'rgba(255,130,0,0.3)',
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 32,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
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
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default OnboardingScreen;
