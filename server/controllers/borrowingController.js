import borrowingService from '../services/borrowingService.js';

class BorrowingController {
  /**
   * GET /api/borrowings/dashboard
   * Fetches high-level metrics cards data and the recent ledger logs
   */
  async getDashboardData(req, res, next) {
    try {
      const data = await borrowingService.fetchDashboardState();
      
      return res.status(200).json({
        success: true,
        metrics: data.metrics[0], // Extract the single row result from Postgres aggregation
        transactions: data.transactions
      });
    } catch (err) {
      next(err); // Hands off error handling to the Express global middleware
    }
  }

  /**
   * POST /api/borrowings
   * Registers a brand new item lending record manually and prepares the QR payload
   */
  async createBorrowing(req, res, next) {
    try {
      const { item_name, borrower_name, office_name, date_borrowed } = req.body;

      // Delegate payload processing to the atomic transactional service layer
      const tx = await borrowingService.registerBorrowing({
        item_name,
        borrower_name,
        office_name,
        date_borrowed
      });

      return res.status(201).json({
        success: true,
        transactionId: tx.id, // Returns the newly generated sequential Primary Key for the frontend QR generator
        message: "Lending transaction recorded successfully."
      });
    } catch (err) {
      // Capture business rule errors (e.g., trying to borrow an already borrowed item)
      if (err.message.includes('currently out')) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    }
  }

  /**
   * POST /api/borrowings/:id/return
   * Processes a rapid camera-scanned item check-in using the transaction ID
   */
  async processReturn(req, res, next) {
    try {
      const transactionId = parseInt(req.params.id, 10);

      if (isNaN(transactionId)) {
        return res.status(400).json({ success: false, message: "Invalid transaction ID format." });
      }

      const result = await borrowingService.registerReturn(transactionId);

      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (err) {
      if (err.message.includes('Invalid') || err.message.includes('already been closed')) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    }
  }
}

export default new BorrowingController();
