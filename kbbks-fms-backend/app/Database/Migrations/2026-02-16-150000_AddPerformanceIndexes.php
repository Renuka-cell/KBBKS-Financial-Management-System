<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddPerformanceIndexes extends Migration
{
    public function up()
    {
        $this->db = \Config\Database::connect();

        // Add index on token field (fast token lookups on every request)
        $this->db->query('ALTER TABLE users ADD INDEX idx_token (token)');

        // Add indexes on foreign keys (fast joins and filtering)
        $this->db->query('ALTER TABLE bills ADD INDEX idx_vendor_id (vendor_id)');
        $this->db->query('ALTER TABLE expenses ADD INDEX idx_vendor_id (vendor_id)');
        $this->db->query('ALTER TABLE invoice ADD INDEX idx_vendor_id (vendor_id)');
        $this->db->query('ALTER TABLE payments ADD INDEX idx_bill_id (bill_id)');
        $this->db->query('ALTER TABLE ledgers ADD INDEX idx_vendor_id (vendor_id)');
    }

    public function down()
    {
        $this->db = \Config\Database::connect();

        // Drop indexes if rolling back
        $this->db->query('ALTER TABLE users DROP INDEX idx_token');
        $this->db->query('ALTER TABLE bills DROP INDEX idx_vendor_id');
        $this->db->query('ALTER TABLE expenses DROP INDEX idx_vendor_id');
        $this->db->query('ALTER TABLE invoices DROP INDEX idx_vendor_id');
        $this->db->query('ALTER TABLE payments DROP INDEX idx_bill_id');
        $this->db->query('ALTER TABLE ledgers DROP INDEX idx_vendor_id');
    }
}

