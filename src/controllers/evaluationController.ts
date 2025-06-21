import { Request, Response } from 'express';
import { getWalkScore } from '../services/walkscoreService';
import { getGroceryDistances } from '../services/groceryService';
import { getCommuteTime } from '../services/commuteService';
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
    // Fetch data from all services in parallel
    const [walkscoreResult, groceryResult, commuteResult] = await Promise.all([
      getWalkScore(address),
      getGroceryDistances(address),
      getCommuteTime(address)
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
