import axios from 'axios';
import { config } from '../config/config';

/**
 * Geocodes an address to get latitude and longitude coordinates
 * @param address The address to geocode
 * @returns Promise with latitude and longitude coordinates
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  try {
    // Using Google Maps Geocoding API
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${config.googleMapsApiKey}`;
    
    const response = await axios.get(url);
    
    if (response.data.status !== 'OK' || !response.data.results.length) {
      throw new Error(`Geocoding error: ${response.data.status || 'No results found'}`);
    }
    
    const location = response.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng
    };
  } catch (error: any) {
    console.error('Error geocoding address:', error.message);
    throw new Error(`Failed to geocode address: ${error.message}`);
  }
}
