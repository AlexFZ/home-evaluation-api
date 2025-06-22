import axios from 'axios';
import { WalkscoreResult } from '../models/interfaces';
import { config } from '../config/config';
import { geocodeAddress } from './geocodingService';

/**
 * Fetches the Walk Score for a given address
 * Documentation: https://www.walkscore.com/professional/api.php
 * @param address The address string
 * @param coordinates Optional coordinates (lat/lng) to avoid geocoding
 */
export async function getWalkScore(address: string, coordinates?: { lat: number; lng: number }): Promise<WalkscoreResult> {
  try {
    // Use provided coordinates or geocode the address
    const { lat, lng } = coordinates || await geocodeAddress(address);    
    const formattedAddress = encodeURIComponent(address);
    const url = `https://api.walkscore.com/score?format=json&address=${formattedAddress}&lat=${lat}&lon=${lng}&transit=1&bike=1&wsapikey=${config.walkscoreApiKey}`;
    
    const response = await axios.get(url);
    if (response.status !== 200 || response.data.status !== 1) {
      throw new Error(`Walk Score API error: ${response.data.description || 'Unknown error'}`);
    }
    
    const walkscore = response.data.walkscore.toString();
    const matched = parseInt(walkscore, 10) >= config.criteria.minWalkscore;
    
    return {
      walkscore,
      matched
    };
    
  } catch (error: any) {
    console.error('Error fetching Walk Score:', error.message);
    return {
      walkscore: '0',
      matched: false
    };
  }
}
