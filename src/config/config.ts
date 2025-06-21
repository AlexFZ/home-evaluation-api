import dotenv from 'dotenv';
import path from 'path';
import { AppConfig } from '../models/interfaces';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  walkscoreApiKey: process.env.WALKSCORE_API_KEY || '',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  criteria: {
    minWalkscore: parseInt(process.env.MIN_WALKSCORE || '70', 10),
    maxGroceryWalkMinutes: parseInt(process.env.MAX_GROCERY_WALK_MINUTES || '15', 10),
    maxWorkCommuteMinutes: parseInt(process.env.MAX_WORK_COMMUTE_MINUTES || '30', 10),
  },
  workAddress: process.env.WORK_ADDRESS || '',
  groceryChains: (process.env.GROCERY_CHAINS || '').split(',').filter(Boolean),
};

// Validate required configuration
const validateConfig = (): void => {
  const requiredVars = [
    { key: 'WALKSCORE_API_KEY', value: config.walkscoreApiKey },
    { key: 'GOOGLE_MAPS_API_KEY', value: config.googleMapsApiKey },
    { key: 'WORK_ADDRESS', value: config.workAddress },
  ];

  const missingVars = requiredVars.filter(v => !v.value);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.map(v => v.key).join(', ')}`
    );
  }
};

export { config, validateConfig };
