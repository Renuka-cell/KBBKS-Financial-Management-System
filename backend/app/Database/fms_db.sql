CREATE DATABASE IF NOT EXISTS fms_db;
USE fms_db;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- -----------------------------
-- vendors
-- -----------------------------
CREATE TABLE vendors (
  vendor_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  logo VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (vendor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- bills
-- -----------------------------
CREATE TABLE bills (
  bill_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_id INT UNSIGNED NOT NULL,
  bill_number VARCHAR(100) DEFAULT NULL,
  bill_date DATE NOT NULL,
  bill_amount DECIMAL(12,2) NOT NULL,
  bill_file VARCHAR(255) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (bill_id),
  KEY idx_vendor_id (vendor_id),
  CONSTRAINT bills_vendor_id_foreign
    FOREIGN KEY (vendor_id)
    REFERENCES vendors(vendor_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- expenses
-- -----------------------------
CREATE TABLE expenses (
  expense_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT DEFAULT NULL,
  bill_file VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (expense_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- invoices
-- -----------------------------
CREATE TABLE invoices (
  invoice_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  bill_id INT UNSIGNED NOT NULL,
  invoice_number VARCHAR(100) DEFAULT NULL,
  invoice_date DATE NOT NULL,
  invoice_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (invoice_id),
  KEY invoices_bill_id_foreign (bill_id),
  CONSTRAINT invoices_bill_id_foreign
    FOREIGN KEY (bill_id)
    REFERENCES bills(bill_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- ledger
-- -----------------------------
CREATE TABLE ledger (
  ledger_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reference_type VARCHAR(50) NOT NULL,
  reference_id INT DEFAULT NULL,
  vendor_id INT DEFAULT NULL,
  debit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  credit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  entry_date DATE DEFAULT NULL,
  created_at DATETIME DEFAULT NULL,
  PRIMARY KEY (ledger_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- payments
-- -----------------------------
CREATE TABLE payments (
  payment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  bill_id INT UNSIGNED NOT NULL,
  payment_date DATE NOT NULL,
  amount_paid DECIMAL(12,2) NOT NULL,
  payment_mode ENUM('Cash','Cheque','NEFT','UPI') NOT NULL,
  reference_no VARCHAR(100) DEFAULT NULL,
  instrument_file VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (payment_id),
  KEY payments_bill_id_foreign (bill_id),
  CONSTRAINT payments_bill_id_foreign
    FOREIGN KEY (bill_id)
    REFERENCES bills(bill_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- users
-- -----------------------------
CREATE TABLE users (
  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'User',
  token VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------
-- Demo Admin User
-- Email: admin@test.com
-- Password: password123
-- -----------------------------
INSERT INTO users (name, email, password, role)
VALUES (
'Admin',
'admin@test.com',
'$2y$10$KIXQq1T9U7k6KkqXh4u8kOeYx3x5Uqz7dCwF2eBf3G0sX8T3pZ0HG',
'Admin'
);

COMMIT;