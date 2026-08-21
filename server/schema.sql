CREATE TABLE IF NOT EXISTS borrowings (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(160) NOT NULL,
  borrower_name VARCHAR(120) NOT NULL,
  borrowed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL DEFAULT 'borrowed'
    CHECK (status IN ('borrowed', 'returned', 'overdue'))
);

INSERT INTO borrowings (item_name, borrower_name, due_at, status)
SELECT 'MacBook Pro 14-inch', 'Maya Chen', NOW() + INTERVAL '5 days', 'borrowed'
WHERE NOT EXISTS (SELECT 1 FROM borrowings);
