import axios from 'axios';
import { CommuteResult } from '../models/interfaces';
import { config } from '../config/config';

/**
 * Calculates the commute time via public transit from the address to the work location
 * @param address The address string
 * @param coordinates Optional coordinates (lat/lng) to avoid geocoding
 */
export async function getCommuteTime(address: string, coordinates?: { lat: number; lng: number }): Promise<CommuteResult> {
  try {
    // Use the Google Maps Directions API to get transit directions
    // If coordinates are provided, use them as origin instead of the address string
    const origin = coordinates ? `${coordinates.lat},${coordinates.lng}` : encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${encodeURIComponent(config.workAddress)}&mode=transit&key=${config.googleMapsApiKey}`;
    
    const response = await axios.get(url);
    
    if (response.data.status !== 'OK' || !response.data.routes.length) {
      throw new Error(`Transit directions not available: ${response.data.status}`);
    }
    
    // Get the first route's duration
    const transitSeconds = response.data.routes[0].legs[0].duration.value;
    const transitMinutes = Math.round(transitSeconds / 60);
    
    // Check if the commute meets the criteria threshold
    const matched = transitMinutes <= config.criteria.maxWorkCommuteMinutes;
    
    return {
      transitMinutes,
      matched
    };
  } catch (error: any) {
    console.error('Error calculating commute time:', error.message);
    return {
      transitMinutes: -1,
      matched: false
    };
  }
}
