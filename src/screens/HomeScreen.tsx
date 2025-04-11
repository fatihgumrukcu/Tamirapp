import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, Region, MapType, PROVIDER_GOOGLE } from 'react-native-maps';
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
  const [mapTypeMenuVisible, setMapTypeMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message: 'Haritayı gösterebilmek için konum iznine ihtiyacımız var.',
            buttonNeutral: 'Daha Sonra',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(' Konum izni verildi');
          getCurrentLocation();
        } else {
          console.log(' Konum izni reddedildi');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude: 41.004447304134246,
          longitude: 29.150110929930978,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
         // Haritayı yeni konuma odakla
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000); // 1000 ms animasyon süresi
        }
      },
      (error) => {
        console.log('🚫 Konum alınamadı:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const searchNearby = async (keyword: string, category: string) => {
    if (!region) return;
    setSelectedCategory(category);
  
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      keyword
    )}&location=${region.latitude},${region.longitude}&radius=5000&key=${GOOGLE_API_KEY}`;
  
    try {
      const response = await axios.get(url);
      const results = response.data.results || [];
  
      console.log("🔍 Gelen sonuç sayısı:", results.length);
  
      const filteredResults = results.filter((place: any) => {
        const name = place.name?.toLowerCase() || '';
        const types = place.types || [];
  
        const isTamirci =
          (name.includes('tamir') || name.includes('servis')) &&
          !name.includes('parça') &&
          (types.includes('car_repair') || types.includes('car_service'));
  
        const isParçacı =
          (name.includes('parça') || name.includes('yedek')) &&
          !name.includes('tamir') &&
          (types.includes('store') || types.includes('car_parts'));
  
        const isTow =
          (name.includes('çekici') || types.includes('car_towing')) &&
          !name.includes('tamir') &&
          !name.includes('parça');
  
        if (category === 'tamirci') return isTamirci;
        if (category === 'parçacı') return isParçacı;
        if (category === 'çekici') return isTow;
  
        return false;
      });
  
      console.log("✅ Filtrelenmiş sonuç sayısı:", filteredResults.length);
      console.log("📍 İlk konum:", filteredResults[0]?.geometry?.location);
  
      setPlaces(filteredResults);
  
      // Haritayı ilk sonuç konumuna odakla
      if (filteredResults.length > 0 && mapRef.current) {
        const first = filteredResults[0].geometry.location;
      }
  
    } catch (error) {
      console.error(`❌ Arama hatası (${keyword}):`, error);
    }
  };
  

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const icon = require('../assets/icons/cursor.png');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          mapType={mapType}
          // provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          provider="google"
          followsUserLocation={true}
          initialRegion={{
            latitude: 41.005082,
            longitude: 29.149471,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker 
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }} 
            anchor={{ x: 0.5, y: 0.5 }}
            icon={icon} />

          {places.map((place, index) => {
            const lat = place.geometry?.location?.lat;
            const lng = place.geometry?.location?.lng;
            if (!lat || !lng) return null;

            const name = place.name?.toLowerCase() || '';
            const isRepair = name.includes('tamir') || name.includes('servis');
            const isTow = name.includes('çekici');

            let icon = require('../assets/icons/shop.png');
            if (isRepair) icon = require('../assets/icons/wrench.png');
            else if (isTow) icon = require('../assets/icons/tow_truck.png');

            return (
              <Marker
                key={index}
                coordinate={{ latitude: lat, longitude: lng }}
                onPress={() => navigation.navigate('Detail', { place })}
                anchor={{ x: 0.5, y: 0.5 }}
                icon={icon}
                style={{ width: 10, height: 10 }}
              />
            );
          })}
        </MapView>
      )}

      <TouchableOpacity style={styles.mapTypeToggle} onPress={() => setMapTypeMenuVisible(prev => !prev)}>
        <Ionicons name="layers-outline" size={22} color="#fff" />
      </TouchableOpacity>

      {mapTypeMenuVisible && (
        <View style={styles.mapTypeDropdown}>
          {['standard', 'satellite', 'hybrid'].map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setMapType(type as MapType);
                setMapTypeMenuVisible(false);
              }}
              style={styles.mapTypeButton}
            >
              <Text style={styles.mapTypeText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.googleLocateButton} onPress={getCurrentLocation}>
        <Ionicons name="location-sharp" size={20} color="#007aff" />
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, selectedCategory === 'tamirci' && { backgroundColor: '#4CAF50' }]}
          onPress={() => searchNearby('motosiklet tamircisi', 'tamirci')}
        >
          <Ionicons name="construct-outline" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonLabel}>Tamircileri Göster</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ffa600' }, selectedCategory === 'parçacı' && { backgroundColor: '#4CAF50' }]}
          onPress={() => searchNearby('motosiklet yedek parça', 'parçacı')}
        >
          <Ionicons name="cog-outline" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonLabel}>Parçacıları Göster</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#cc4a00' }, selectedCategory === 'çekici' && { backgroundColor: '#4CAF50' }]}
          onPress={() => searchNearby('çekici hizmeti', 'çekici')}
        >
          <Ionicons name="car-outline" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonLabel}>Çekici Hizmeti</Text>
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
  mapTypeToggle: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#ff8200',
    padding: 12,
    borderRadius: 25,
    zIndex: 6,
  },
  mapTypeDropdown: {
    position: 'absolute',
    top: 160,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 5,
  },
  mapTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  mapTypeText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#333',
  },
});

export default HomeScreen;
