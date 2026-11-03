CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  product TEXT NOT NULL,
  message TEXT,
  privacy_consent INTEGER NOT NULL DEFAULT 0,
  public_name_consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_product ON enquiries(product);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,          -- e.g. FO-INV-0001, sent to the client
  client_name TEXT NOT NULL,
  description TEXT NOT NULL,               -- e.g. "Deposit — L'Astre Noir, edition 3/24"
  amount INTEGER NOT NULL CHECK (amount >= 100), -- smallest currency unit (paise for INR)
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'issued',   -- issued | paid | cancelled
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
