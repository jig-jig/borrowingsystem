import borrowingRepository from '../repositories/borrowingRepository.js';
import pool from '../db/pool.js';

class BorrowingService {
  async registerBorrowing(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let item = await borrowingRepository.findItemByName(data.item_name, client);
      
      if (!item) {
        item = await borrowingRepository.createItem(data.item_name, 'BORROWED', client);
      } else {
        if (item.status === 'BORROWED') {
          throw new Error('This item is currently out and has not been returned yet.');
        }
        await borrowingRepository.updateItemStatus(item.id, 'BORROWED', client);
      }

      const tx = await borrowingRepository.insertTransaction(
        item.id, 
        data.borrower_name, 
        data.office_name, 
        data.date_borrowed, 
        client
      );

      await client.query('COMMIT');
      return tx;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async registerReturn(transactionId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const tx = await borrowingRepository.findTransactionById(transactionId);
      if (!tx) throw new Error('Invalid or unrecorded transaction QR code.');
      if (tx.date_returned) throw new Error('This transaction has already been closed.');

      await borrowingRepository.completeTransaction(transactionId, tx.item_id, client);

      await client.query('COMMIT');
      return { message: "Item check-in complete" };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async fetchDashboardState() {
    const [metrics, transactions] = await Promise.all([
      borrowingRepository.getDashboardMetrics(),
      borrowingRepository.getRecentLogs()
    ]);
    return { metrics, transactions };
  }
}

export default new BorrowingService();
