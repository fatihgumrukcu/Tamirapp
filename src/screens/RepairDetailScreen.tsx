import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

type PlaceType = {
  name?: string;
  found_name?: string;
  formatted_address: string;
  phone?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

type RouteParams = {
  params: { place: PlaceType };
};

const FAVORITES_KEY = 'FAVORITE_PLACES';

const RepairDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const place = route.params.place;

  const [isFavorite, setIsFavorite] = useState(false);
  const { isDarkMode } = useTheme();

  const name = place.found_name || place.name || 'Servis';
  const phone = place.phone || null;
  const address = place.formatted_address;

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = json ? JSON.parse(json) : [];
    const exists = favorites.some((item: PlaceType) => item.formatted_address === place.formatted_address);
    setIsFavorite(exists);
  };

  const toggleFavorite = async () => {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = json ? JSON.parse(json) : [];
    let updated = [];

    if (isFavorite) {
      updated = favorites.filter((item: PlaceType) => item.formatted_address !== place.formatted_address);
      Alert.alert('Favorilerden çıkarıldı');
    } else {
      updated = [...favorites, place];
      Alert.alert('Favorilere eklendi');
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const openInMaps = () => {
    const query = encodeURIComponent(`${name} ${address}`);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
  };

  const callPhone = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' },
      ]}
    >
      <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>{name}</Text>

      <Text style={[styles.info, isDarkMode && { color: '#ccc' }]}>
        Adres: {address}
      </Text>

      {phone && (
        <Text style={[styles.info, isDarkMode && { color: '#ccc' }]}>
          Telefon: {phone}
        </Text>
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#0a84ff' }]} onPress={openInMaps}>
        <Text style={styles.buttonText}>Yol Tarifi Al</Text>
      </TouchableOpacity>

      {phone && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#34c759' }]} onPress={callPhone}>
          <Text style={styles.buttonText}>Ara</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ff8200' }]} onPress={toggleFavorite}>
        <Text style={styles.buttonText}>{isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: '#fff',
  },
});

export default RepairDetailScreen;
