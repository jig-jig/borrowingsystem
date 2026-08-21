import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import pg from 'pg'
import borrowingRoutes from './routes/borrowingRoutes.js'

const { Pool } = pg
const app = express()
const port = process.env.PORT || 3001
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(cors())
app.use(express.json())
app.use('/api/borrowings', borrowingRoutes)

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    response.status(503).json({ status: 'degraded', database: 'unavailable' })
  }
})

app.get('/api/borrowings', async (_request, response) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, item_name, borrower_name, borrowed_at, due_at, status FROM borrowings ORDER BY borrowed_at DESC'
    )
    response.json(rows)
  } catch (error) {
    response.status(500).json({ error: 'Unable to load borrowings' })
  }
})

app.listen(port, () => {
  console.log(`Borrowing System API running at http://localhost:${port}`)
})
