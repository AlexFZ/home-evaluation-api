import axios from 'axios';
import { CommuteResult } from '../models/interfaces';
import { config } from '../config/config';

/**
 * Calculates the commute time via public transit from the address to the work location
 */
export async function getCommuteTime(address: string): Promise<CommuteResult> {
  try {
    // Use the Google Maps Directions API to get transit directions
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(address)}&destination=${encodeURIComponent(config.workAddress)}&mode=transit&key=${config.googleMapsApiKey}`;
    
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
