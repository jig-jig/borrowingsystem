CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BORROWED'))
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    borrower_name VARCHAR(255) NOT NULL,
    office_name VARCHAR(255) NOT NULL,
    date_borrowed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_returned TIMESTAMP NULL
);

-- Index for blazing fast dashboard counts and lookups
CREATE INDEX IF NOT EXISTS idx_transactions_returned_at ON transactions(date_returned);
