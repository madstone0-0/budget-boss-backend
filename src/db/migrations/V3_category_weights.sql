ALTER TABLE  category ADD COLUMN IF NOT EXISTS weight decimal(5,2) CONSTRAINT percentage CHECK ( weight >= 0 AND weight <= 100 ) NOT NULL DEFAULT 0.00;
