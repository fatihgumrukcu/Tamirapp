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

const FinalOnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/images/shoppinguser.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <FadeSlideTransition direction="right">
          <View style={styles.topSection}>
            <Text style={styles.title}>Yedek Parçaya mı İhtiyacın Var?</Text>

            <Text style={styles.subtitle}>
              Tamirapp sayesinde artık yedek parça aramak için saatler harcaman gerekmiyor. Uygulama,
              konumuna en yakın yedek parça satıcılarını harita üzerinden kolayca görüntülemeni sağlar.
            </Text>

            <Text style={styles.subtitle}>
              Her satıcıya tek tıkla ulaşabilir, yol tarifi alabilir ve doğrudan iletişime geçebilirsin.
              İhtiyacın olan parçayı bulmak artık çok daha kolay ve hızlı.
            </Text>

            <Text style={styles.subtitle}>
              Tamirapp kullanıcı dostu arayüzü ve işlevsel yapısıyla motosiklet sahiplerine yepyeni
              bir kolaylık sunar. Seni de bu deneyime davet ediyoruz.
            </Text>
          </View>
        </FadeSlideTransition>

        <FadeSlideTransition direction="right">
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace('Tabs')}
            >
              <Text style={styles.buttonText}>Uygulamaya Başla</Text>
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

export default FinalOnboardingScreen;
