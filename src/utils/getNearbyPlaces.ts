import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyAhX_qab75bK7JSEhHxnTHh9E32jpoO9YI';

export const searchNearbyMotorcycleShopsAndParts = async (lat: number, lng: number) => {
    const queries = ['motosiklet tamircisi', 'motosiklet yedek parça'];
    const radiusOptions = [1000, 2000, 3000, 5000, 8000, 10000];
    let allResults: any[] = [];
  
    for (const query of queries) {
      for (const radius of radiusOptions) {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&location=${lat},${lng}&radius=${radius}&key=${GOOGLE_API_KEY}`;
  
        try {
          const response = await axios.get(url);
          const results = response.data.results || [];
  
          if (results.length > 0) {
            console.log(`🔍 "${query}" içinde ${radius}m içinde bulundu:`, results.length);
            allResults = [...allResults, ...results];
            break; // Bu query için bulduysa diğer radius'lara gerek yok
          }
        } catch (error) {
          console.error(`❌ ${radius}m içinde "${query}" hatası:`, error);
        }
      }
    }
  
    // 🔁 Aynı yer iki kere gelmesin diye filtrele
    const uniquePlaces = Array.from(
      new Map(allResults.map(p => [p.place_id, p])).values()
    );
  
    console.log('🧩 Toplam gösterilecek yer sayısı:', uniquePlaces.length);
    setPlaces(uniquePlaces);
  };

function setPlaces(uniquePlaces: any[]) {
    throw new Error('Function not implemented.');
}
  