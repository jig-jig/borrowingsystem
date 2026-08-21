import express from 'express';
import borrowingController from '../controllers/borrowingController.js';

const router = express.Router();

// Route: Get dashboard aggregated stats cards and logging table entries
router.get('/dashboard', borrowingController.getDashboardData);

// Route: Post manual entry profile input form data to generate a receipt QR code
router.post('/', borrowingController.createBorrowing);

// Route: Trigger automatic scan check-in processing via incoming scanned URL params
router.post('/:id/return', borrowingController.processReturn);

export default router;
