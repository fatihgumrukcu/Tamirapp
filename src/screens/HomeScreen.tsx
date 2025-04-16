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
import MapView, { Marker, Region, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

import repairData from '../data/Repair_service.json';
import partsData from '../data/Spare_parts.json';
import towData from '../data/Towing_services.json';
import hondaData from '../data/Honda_services.json';
import yamahaData from '../data/Yamaha_services.json';

const HomeScreen = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) getCurrentLocation();
        else console.log('Konum izni reddedildi');
      } catch (err) {
        console.warn(err);
      }
    } else {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') getCurrentLocation();
      else console.log('❌ iOS: Konum izni reddedildi');
    }
  };

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
      error => console.log('Konum alınamadı:', error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleFilter = () => {
    switch (selectedCategory) {
      case 'tamirci':
        setPlaces(repairData);
        break;
      case 'parçacı':
        setPlaces(partsData);
        break;
      case 'cekici':
        setPlaces(towData);
        break;
      case 'honda':
        setPlaces(hondaData);
        break;
      case 'yamaha':
        setPlaces(yamahaData);
        break;
      default:
        setPlaces([]);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      handleFilter();
    }
  }, [selectedCategory]);

  const renderCustomMarker = () => {
    if (!region) return null;
    const coord = { latitude: region.latitude, longitude: region.longitude };
    const icon = require('../assets/icons/cursor.png');

    return (
      <Marker coordinate={coord} anchor={{ x: 0.5, y: 0.5 }} icon={Platform.OS === 'android' ? icon : undefined}>
        {Platform.OS === 'ios' && (
          <Image source={icon} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
        )}
      </Marker>
    );
  };

  const renderPlaceMarker = (place: any, index: number) => {
    const lat = place.geometry?.location?.lat;
    const lng = place.geometry?.location?.lng;
    if (!lat || !lng || !selectedCategory) return null;

    const name = place.found_name || place.name || 'Servis';

    let icon;
    if (selectedCategory === 'tamirci') {
      icon = require('../assets/icons/wrench.png');
    } else if (selectedCategory === 'parçacı') {
      icon = require('../assets/icons/shop.png');
    } else if (selectedCategory === 'cekici') {
      icon = require('../assets/icons/tow_truck.png');
    } else if (selectedCategory === 'honda') {
      icon = require('../assets/icons/honda.png');
    } else if (selectedCategory === 'yamaha') {
      icon = require('../assets/icons/yamaha.png');
    } else {
      return null;
    }

    return (
      <Marker
        key={index}
        coordinate={{ latitude: lat, longitude: lng }}
        onPress={() => navigation.navigate('Detail', { place })}
        anchor={{ x: 0.5, y: 0.5 }}
        icon={Platform.OS === 'android' ? icon : undefined}
      >
        {Platform.OS === 'ios' && (
          <Image source={icon} style={{ width: 42, height: 42, resizeMode: 'contain' }} />
        )}
      </Marker>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={false}
          mapType="standard"
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          followsUserLocation
          initialRegion={region}
        >
          {renderCustomMarker()}
          {places.map(renderPlaceMarker)}
        </MapView>
      )}

      <TouchableOpacity style={styles.floatingFilterButton} onPress={() => setFilterVisible(!filterVisible)}>
        <Ionicons name="options-outline" size={22} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={getCurrentLocation}
      >
        <Ionicons name="locate" size={22} color="#fff" />
      </TouchableOpacity>

      

      {filterVisible && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Ne arıyorsun?</Text>
          {[
            { key: 'tamirci', label: 'Tamirciler', icon: 'construct-outline' },
            { key: 'parçacı', label: 'Yedek Parçacılar', icon: 'cog-outline' },
            { key: 'cekici', label: 'Çekiciler', icon: 'car-sport-outline' },
            { key: 'honda', label: 'Honda Servisleri', icon: 'business-outline' }, // 🔄 GÜNCELLENDİ
            { key: 'yamaha', label: 'Yamaha Servisleri', icon: 'business-outline' }, // 🔄 GÜNCELLENDİ
          ].map(item => {
            const isSelected = selectedCategory === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.filterItem}
                onPress={() => setSelectedCategory(item.key)}
              >
                <View style={styles.filterLeft}>
                  <Ionicons name={item.icon} size={20} color="#ff8200" style={{ marginRight: 8 }} />
                  <Text style={[styles.filterText, isSelected && styles.selectedText]}>{item.label}</Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color="#ff8200" />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  floatingFilterButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#ff8200',
    padding: 14,
    borderRadius: 30,
    zIndex: 6,
    elevation: 4,
  },
  filterContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 16,
    color: '#ff8200',
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationButton: {
    position: 'absolute',
    bottom: 50, // filtre butonunun biraz altı
    right: 20,
    backgroundColor: '#ff8200',
    padding: 14,
    borderRadius: 30,
    zIndex: 6,
    elevation: 4,
  },
  
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#000',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#ff8200',
  },
  fixedApplyButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 11,
  },
  applyFilterButton: {
    backgroundColor: '#ff8200',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyFilterText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default HomeScreen;
