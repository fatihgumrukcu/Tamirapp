// src/screens/FinalOnboardingScreen.tsx
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

const FinalOnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/images/shoppinguser.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}> Yedek Parçaya mı ihtiyacın var?</Text>
          <Text style={styles.subtitle}>Yedek parça satıcılarını da harita üzerinde bulabilir, ihtiyacın olan parçayı kolayca temin edebilirsin.</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('Tabs')}
          >
            <Text style={styles.buttonText}>Uygulamaya Başla</Text>
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
    backgroundColor: 'rgba(255,130,0,0.25)',
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
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
    fontSize: 17,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default FinalOnboardingScreen;
