-- Migration for LAPORAN TBK WLR 2026 Database Schema
-- Compatible with SQLite and PostgreSQL

-- 1. Suppliers table
CREATE TABLE IF NOT EXISTS "Supplier" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL
);

-- 2. Weighing Headers table
CREATE TABLE IF NOT EXISTS "WeighingHeader" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "transaction_code" TEXT NOT NULL UNIQUE,
    "supplier_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "location_stamp" TEXT NOT NULL,
    "signee_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id")
);

-- 3. Weighing Items table
CREATE TABLE IF NOT EXISTS "WeighingItem" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "header_id" INTEGER NOT NULL,
    "item_no" INTEGER NOT NULL,
    "item_label" TEXT NOT NULL,
    "gross_weight" REAL NOT NULL,
    "net_weight" REAL NOT NULL,
    "price_per_kg" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    FOREIGN KEY ("header_id") REFERENCES "WeighingHeader"("id") ON DELETE CASCADE
);

-- 4. Deductions table
CREATE TABLE IF NOT EXISTS "Deductions" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "header_id" INTEGER NOT NULL UNIQUE,
    "ppn_amount" REAL NOT NULL DEFAULT 0,
    "kasut_amount" REAL NOT NULL DEFAULT 0,
    "keranjang_amount" REAL NOT NULL DEFAULT 0,
    "total_deduction" REAL NOT NULL,
    "final_payout" REAL NOT NULL,
    FOREIGN KEY ("header_id") REFERENCES "WeighingHeader"("id") ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_weighing_header_supplier" ON "WeighingHeader"("supplier_id");
CREATE INDEX IF NOT EXISTS "idx_weighing_item_header" ON "WeighingItem"("header_id");
CREATE INDEX IF NOT EXISTS "idx_deductions_header" ON "Deductions"("header_id");
