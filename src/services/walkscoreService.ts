import axios from 'axios';
import { WalkscoreResult } from '../models/interfaces';
import { config } from '../config/config';

/**
 * Fetches the Walk Score for a given address
 * Documentation: https://www.walkscore.com/professional/api.php
 */
export async function getWalkScore(address: string): Promise<WalkscoreResult> {
  try {
    const formattedAddress = encodeURIComponent(address);
    const url = `https://api.walkscore.com/score?format=json&address=${formattedAddress}&lat=0&lon=0&transit=1&bike=1&wsapikey=${config.walkscoreApiKey}`;
    
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
