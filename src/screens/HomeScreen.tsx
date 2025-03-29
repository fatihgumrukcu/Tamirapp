import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const GOOGLE_API_KEY = 'AIzaSyAhX_qab75bK7JSEhHxnTHh9E32jpoO9YI';

const HomeScreen = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
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

  const searchNearby = async (query: string) => {
    if (!region) return;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&location=${region.latitude},${region.longitude}&radius=5000&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results || [];
      setPlaces(results);
    } catch (error) {
      console.error(`❌ Arama hatası (${query}):`, error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
        >
          <Marker
            coordinate={region}
            title="Senin Konumun"
            pinColor="blue"
          />

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

      <TouchableOpacity style={styles.googleLocateButton} onPress={getCurrentLocation}>
        <Ionicons name="location-sharp" size={20} color="#007aff" />
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: '#0a84ff' }]}
          onPress={() => searchNearby('motosiklet tamircisi')}
        >
          <Text style={styles.searchText}>Tamircileri Göster</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: '#34c759' }]}
          onPress={() => searchNearby('motosiklet yedek parça')}
        >
          <Text style={styles.searchText}>Parçacıları Göster</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    gap: 12,
  },
  searchButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
