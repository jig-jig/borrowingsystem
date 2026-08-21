import pool from '../db/pool.js';

class BorrowingRepository {
  async findItemByName(name, client = pool) {
    const res = await client.query('SELECT * FROM items WHERE name = $1', [name]);
    return res.rows[0];
  }

  async createItem(name, status, client = pool) {
    const res = await client.query(
      'INSERT INTO items (name, status) VALUES ($1, $2) RETURNING *',
      [name, status]
    );
    return res.rows[0];
  }

  async updateItemStatus(id, status, client = pool) {
    await client.query('UPDATE items SET status = $1 WHERE id = $2', [status, id]);
  }

  async insertTransaction(itemId, borrowerName, officeName, dateBorrowed, client = pool) {
    const res = await client.query(
      `INSERT INTO transactions (item_id, borrower_name, office_name, date_borrowed)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [itemId, borrowerName, officeName, dateBorrowed || new Date()]
    );
    return res.rows[0];
  }

  async findTransactionById(id) {
    const res = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return res.rows[0];
  }

  async completeTransaction(transactionId, itemId, client = pool) {
    await client.query('UPDATE transactions SET date_returned = NOW() WHERE id = $1', [transactionId]);
    await client.query('UPDATE items SET status = \'AVAILABLE\' WHERE id = $1', [itemId]);
  }

  async getDashboardMetrics() {
    const res = await pool.query(`
      SELECT 
        COUNT(CASE WHEN date_returned IS NOT NULL THEN 1 END)::int as returned,
        COUNT(CASE WHEN date_returned IS NULL THEN 1 END)::int as active,
        COUNT(DISTINCT borrower_name)::int as unique_borrowers
      FROM transactions;
    `);
    return res.rows[0];
  }

  async getRecentLogs(limit = 50) {
    const res = await pool.query(`
      SELECT t.id, i.name as item_name, t.office_name, t.borrower_name, t.date_borrowed, t.date_returned 
      FROM transactions t
      JOIN items i ON t.item_id = i.id
      ORDER BY t.date_borrowed DESC LIMIT $1;
    `, [limit]);
    return res.rows;
  }
}

export default new BorrowingRepository();
