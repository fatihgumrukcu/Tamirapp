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
import FadeSlideTransition from '../components/FadeSlideTransition'; // ✅ animasyon bileşeni

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/images/welcome-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <FadeSlideTransition>
          <View style={styles.topContainer}>
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>TamirApp’le Tamir Et</Text>
          </View>
        </FadeSlideTransition>

        <FadeSlideTransition>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Onboarding')}>
              <Text style={styles.buttonText}>BAŞLA</Text>
            </TouchableOpacity>
            {/* <Text style={styles.version}>v1.0.0</Text> */}
          </View>
        </FadeSlideTransition>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,130,0,0.2)',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  bottomContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    backgroundColor: '#ff8200',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 50,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default WelcomeScreen;
