import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/config';
import evaluationRoutes from './routes/evaluationRoutes';

// Create Express server
const app = express();

// Initialize middleware
app.use(express.json());
app.use(cors());

// Simple health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Register routes
app.use('/api', evaluationRoutes);

// Start the server
const startServer = async () => {
  try {
    // Validate configuration before starting
    validateConfig();
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Evaluation endpoint: http://localhost:${config.port}/api/evaluateAddress?address=your_address_here`);
    });
  } catch (error: any) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
