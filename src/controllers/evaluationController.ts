import { Request, Response } from 'express';
import { getWalkScore } from '../services/walkscoreService';
import { getGroceryDistances } from '../services/groceryService';
import { getCommuteTime } from '../services/commuteService';
import { geocodeAddress } from '../services/geocodingService';
import { AddressEvaluationResponse } from '../models/interfaces';

/**
 * Controller function to evaluate an address against all criteria
 */
export async function evaluateAddress(req: Request, res: Response): Promise<void> {
  const address = req.query.address as string;
  
  if (!address) {
    res.status(400).json({
      criteriaResults: {},
      error: 'Address parameter is required'
    });
    return;
  }
  
  try {
    // Geocode the address once to get coordinates
    const coordinates = await geocodeAddress(address);
    
    // Fetch data from all services in parallel, passing the coordinates
    const [walkscoreResult, groceryResult, commuteResult] = await Promise.all([
      getWalkScore(address, coordinates),
      getGroceryDistances(address, coordinates),
      getCommuteTime(address, coordinates)
    ]);
    
    // Prepare the response
    const response: AddressEvaluationResponse = {
      criteriaResults: {
        walkscore: walkscoreResult,
        grocery: groceryResult,
        commute: commuteResult
      },
      error: null
    };
    
    res.json(response);
    
  } catch (error: any) {
    console.error('Error evaluating address:', error);
    
    res.status(500).json({
      criteriaResults: {},
      error: `Error evaluating address: ${error.message}`
    });
  }
}
