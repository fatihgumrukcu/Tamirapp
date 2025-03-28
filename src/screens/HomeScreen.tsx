import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyAhX_qab75bK7JSEhHxnTHh9E32jpoO9YI';

const HomeScreen = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);

  const getNearbyPlaces = async (latitude: number, longitude: number) => {
    const radius = 3000;
    const type = 'car_repair';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get(url);
      console.log('📦 Google API Cevabı:', JSON.stringify(response.data, null, 2));

      if (response.data.status !== 'OK') {
        console.warn('⚠️ Google API Hatası:', response.data.status);
      }

      return response.data.results;
    } catch (error) {
      console.error('❌ Yerler alınamadı:', error);
      return [];
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Konum:', latitude, longitude);

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);

        const nearby = await getNearbyPlaces(latitude, longitude);
        setPlaces(nearby);
        console.log('🧰 Bulunan tamirciler:', nearby.length);
      },
      error => {
        console.log('🚫 Konum alınamadı:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={region}
            title="Senin Konumun"
            description="Buradasın"
            pinColor="blue"
          />

          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor="red"
            />
          ))}
        </MapView>
      )}

      <TouchableOpacity style={styles.locateButton} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>📍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  locateButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default HomeScreen;
