import express from 'express';
import { evaluateAddress } from '../controllers/evaluationController';

const router = express.Router();

// Route to evaluate an address
router.get('/evaluateAddress', evaluateAddress);

export default router;
