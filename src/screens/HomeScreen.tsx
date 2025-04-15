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

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u');

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
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message: 'Haritayı gösterebilmek için konum iznine ihtiyacımız var.',
            buttonNeutral: 'Daha Sonra',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          }
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

  const searchNearby = async (keyword: string, category: string) => {
    if (!region) return;
    setSelectedCategory(category);

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      keyword
    )}&location=${region.latitude},${region.longitude}&radius=3000&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results || [];

      const filteredResults = results.filter((place: any) => {
        const name = normalizeText(place.name || '');
        const types = place.types || [];

        const isTamirci =
          name.includes('tamir') &&
          !name.includes('parca') &&
          (types.includes('car_repair') || types.includes('car_service'));

        const isParcaci =
          name.includes('parca') &&
          !name.includes('tamir') &&
          (types.includes('store') || types.includes('car_parts'));

        const isCekici =
          name.includes('cekici') &&
          !name.includes('tamir') &&
          !name.includes('parca');

        if (category === 'tamirci') return isTamirci;
        if (category === 'parçacı') return isParcaci;
        if (category === 'çekici') return isCekici;

        return false;
      });

      setPlaces(filteredResults);

    } catch (error) {
      console.error(`❌ Arama hatası (${keyword}):`, error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
    if (!lat || !lng) return null;

    const name = normalizeText(place.name || '');
    const isRepair = name.includes('tamir');
    const isTow = name.includes('cekici');

    let icon = require('../assets/icons/shop.png');
    if (isRepair) icon = require('../assets/icons/wrench.png');
    else if (isTow) icon = require('../assets/icons/tow_truck.png');

    return (
      <Marker
        key={index}
        coordinate={{ latitude: lat, longitude: lng }}
        onPress={() => navigation.navigate('Detail', { place })}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        {Platform.OS === 'android' ? null : (
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
          mapType={mapType}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          followsUserLocation
          initialRegion={region}
        >
          {renderCustomMarker()}
          {places.map(renderPlaceMarker)}
        </MapView>
      )}

      <TouchableOpacity
        style={styles.floatingFilterButton}
        onPress={() => setFilterVisible(!filterVisible)}
      >
        <Ionicons name="filter" size={22} color="#fff" />
      </TouchableOpacity>

      {filterVisible && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Ne arıyorsun?</Text>
          {[
            { key: 'tamirci', label: 'Motosiklet Tamircileri', icon: 'construct-outline' },
            { key: 'parçacı', label: 'Yedek Parça Satıcıları', icon: 'cog-outline' },
            { key: 'çekici', label: 'Yol Yardım Hizmeti', icon: 'car-sport-outline' },
            { key: 'honda', label: 'Honda Yetkili Servisleri', icon: 'build-outline' },
            { key: 'yamaha', label: 'Yamaha Yetkili Servisleri', icon: 'build-outline' },
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
                  <Text style={[styles.filterText, isSelected && styles.selectedText]}>
                    {item.label}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color="#ff8200" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.fixedApplyButtonWrapper}>
        <TouchableOpacity
          style={styles.applyFilterButton}
          onPress={() => {
            if (selectedCategory === 'tamirci')
              searchNearby('motosiklet tamircisi', 'tamirci');
            else if (selectedCategory === 'parçacı')
              searchNearby('motosiklet yedek parça', 'parçacı');
            else if (selectedCategory === 'çekici')
              searchNearby('çekici hizmeti', 'çekici');
            else
              console.log('JSON tabanlı servis gösterimi yapılacak:', selectedCategory);
          }}
        >
          <Text style={styles.applyFilterText}>Filtreyi Uygula</Text>
        </TouchableOpacity>
      </View>
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
