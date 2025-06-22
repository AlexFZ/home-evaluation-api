import axios from 'axios';
import { GroceryResult, GroceryStore } from '../models/interfaces';
import { config } from '../config/config';
import { geocodeAddress } from './geocodingService';

/**
 * Gets walking distances to specified grocery stores near an address
 * @param address The address string
 * @param coordinates Optional coordinates (lat/lng) to avoid geocoding
 */
export async function getGroceryDistances(address: string, coordinates?: { lat: number; lng: number }): Promise<GroceryResult> {
  try {
    // Use provided coordinates or geocode the address
    const { lat, lng } = coordinates || await geocodeAddress(address);
    const groceryDistances: GroceryStore[] = [];    
    for (const chain of config.groceryChains) {
      try {
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=grocery_or_supermarket&keyword=${encodeURIComponent(chain)}&key=${config.googleMapsApiKey}`;
        const placesResponse = await axios.get(placesUrl);
        
        if (placesResponse.data.status === 'OK' && placesResponse.data.results.length > 0) {
          const nearestStore = placesResponse.data.results[0];
          
          // Get walking distance
          const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=place_id:${nearestStore.place_id}&mode=walking&key=${config.googleMapsApiKey}`;
          const distanceResponse = await axios.get(distanceUrl);
          if (distanceResponse.data.status === 'OK') {
            const element = distanceResponse.data.rows[0].elements[0];
            if (element.status === 'OK') {
              const walkSeconds = element.duration.value;
              const walkMinutes = Math.round(walkSeconds / 60);
              groceryDistances.push({
                name: `${chain} (${nearestStore.name})`,
                walkMinutes
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error processing grocery chain ${chain}:`, error);
        // Continue with the next chain
      }
    }
    
    // Check if any grocery store meets the criteria
    const matched = groceryDistances.some(store => 
      store.walkMinutes <= config.criteria.maxGroceryWalkMinutes
    );
    
    return {
      distances: groceryDistances.sort((a, b) => a.walkMinutes - b.walkMinutes),
      matched
    };
    
  } catch (error: any) {
    console.error('Error getting grocery distances:', error.message);
    return {
      distances: [],
      matched: false
    };
  }
}
