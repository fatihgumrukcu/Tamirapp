import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker, Region, MapType } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOOGLE_API_KEY = 'AIzaSyAhX_qab75bK7JSEhHxnTHh9E32jpoO9YI';

const HomeScreen = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [mapType, setMapType] = useState<MapType>('standard');
  const mapRef = useRef<MapView | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      error => {
        console.log('🚫 Konum alınamadı:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const searchNearby = async (keyword: string) => {
    if (!region) return;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      keyword
    )}&location=${region.latitude},${region.longitude}&radius=5000&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results || [];
      setPlaces(results);
    } catch (error) {
      console.error(`❌ Arama hatası (${keyword}):`, error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          mapType={mapType}
        >
          <Marker coordinate={region} title="Senin Konumun" pinColor="blue" />

          {places.map((place, index) => {
            const lat = place.geometry?.location?.lat;
            const lng = place.geometry?.location?.lng;
            if (!lat || !lng) return null;

            const name = place.name?.toLowerCase() || '';
            const isRepair = name.includes('tamir') || name.includes('servis');

            const icon = isRepair
              ? require('../assets/icons/wrench.png')
              : require('../assets/icons/shop.png');

            return (
              <Marker
                key={index}
                coordinate={{ latitude: lat, longitude: lng }}
                image={icon}
                onPress={() => navigation.navigate('Detail', { place })}
              />
            );
          })}
        </MapView>
      )}

      {/* 🔘 Harita Türü Seçici */}
      <View style={styles.mapTypeColumn}>
        <TouchableOpacity onPress={() => setMapType('standard')} style={styles.mapTypeButton}>
          <Text style={styles.mapTypeText}>Standart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMapType('satellite')} style={styles.mapTypeButton}>
          <Text style={styles.mapTypeText}>Uydu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMapType('hybrid')} style={styles.mapTypeButton}>
          <Text style={styles.mapTypeText}>Hibrit</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.googleLocateButton} onPress={getCurrentLocation}>
        <Ionicons name="location-sharp" size={20} color="#007aff" />
      </TouchableOpacity>

      {/* 🔍 Arama Aksiyon Butonları */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => searchNearby('motosiklet tamircisi')}
        >
          <Ionicons name="construct-outline" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonLabel}>Tamircileri Göster</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ffa600' }]}
          onPress={() => searchNearby('motosiklet yedek parça')}
        >
          <Ionicons name="cog-outline" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonLabel}>Parçacıları Göster</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  googleLocateButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 5,
  },

  buttonGroup: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    gap: 12,
    zIndex: 4,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff8200',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginVertical: 6,
    minWidth: 240,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  icon: {
    marginRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },

  mapTypeColumn: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 10,
  },
  mapTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 4,
    backgroundColor: '#fff7f0',
    borderRadius: 6,
    alignItems: 'center',
    borderColor: '#ff8200',
    borderWidth: 1,
  },
  mapTypeText: {
    fontSize: 13,
    color: '#ff8200',
    fontFamily: 'Montserrat-Medium',
  },
});

export default HomeScreen;
