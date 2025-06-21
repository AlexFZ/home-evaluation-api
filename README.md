# Home Location Criteria API

This API helps evaluate home locations based on specific criteria, including:
- Walk Score rating
- Proximity to preferred grocery store chains
- Commute time to work via public transit

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - [Walk Score API](https://www.walkscore.com/professional/api.php)
  - Google Maps API (with Places, Directions, and Distance Matrix enabled)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd home-criteria-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Create a `.env` file in the `src/config` directory based on `.env.example`
   - Add your API keys and customize criteria thresholds

```
# API Keys
WALKSCORE_API_KEY=your_walkscore_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Criteria Thresholds
MIN_WALKSCORE=70
MAX_GROCERY_WALK_MINUTES=15
MAX_WORK_COMMUTE_MINUTES=30

# User Work Address
WORK_ADDRESS=your_work_address_here

# Grocery Store Chains (comma-separated)
GROCERY_CHAINS=Safeway,Trader Joe's,Whole Foods,Kroger,Publix
```

## Development

Start the development server:
```bash
npm run dev
```

## Building and Running

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Evaluate Address

**GET /api/evaluateAddress**

Evaluates an address against all configured criteria.

**Query Parameters:**
- `address`: The full address to evaluate (required)

**Example Request:**
```
GET /api/evaluateAddress?address=123 Main St, Anytown, US 12345
```

**Example Response:**
```json
{
  "criteriaResults": {
    "walkscore": {
      "walkscore": "77",
      "matched": true
    },
    "grocery": {
      "distances": [
        {"name": "Safeway (Anytown Center)", "walkMinutes": 12},
        {"name": "Trader Joe's (Central Square)", "walkMinutes": 18}
      ],
      "matched": true
    },
    "commute": {
      "transitMinutes": 25,
      "matched": true
    }
  },
  "error": null
}
```

## Error Handling

The API includes error handling for:
- Missing API keys or configuration
- Invalid addresses
- External API failures
- Missing query parameters

## Extending the API

To add new criteria:
1. Define new interfaces in `src/models/interfaces.ts`
2. Create a new service in the `services` directory
3. Update the evaluation controller to include the new criterion
4. Update the configuration to include any new thresholds
