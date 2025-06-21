// Response interfaces
export interface WalkscoreResult {
  walkscore: string;
  matched: boolean;
}

export interface GroceryStore {
  name: string;
  walkMinutes: number;
}

export interface GroceryResult {
  distances: GroceryStore[];
  matched: boolean;
}

export interface CommuteResult {
  transitMinutes: number;
  matched: boolean;
}

export interface CriteriaResults {
  walkscore: WalkscoreResult;
  grocery: GroceryResult;
  commute: CommuteResult;
}

export interface AddressEvaluationResponse {
  criteriaResults: CriteriaResults;
  error: string | null;
}

// Configuration interfaces
export interface AppConfig {
  port: number;
  walkscoreApiKey: string;
  googleMapsApiKey: string;
  criteria: CriteriaThresholds;
  workAddress: string;
  groceryChains: string[];
}

export interface CriteriaThresholds {
  minWalkscore: number;
  maxGroceryWalkMinutes: number;
  maxWorkCommuteMinutes: number;
}
