<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddReferenceNoAndUpiToPayments extends Migration
{
    public function up()
    {
        // Add reference_no column (nullable)
        if (!$this->db->fieldExists('reference_no', 'payments')) {
            $this->forge->addColumn('payments', [
                'reference_no' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 100,
                    'null'       => true,
                    'after'      => 'payment_mode',
                ],
            ]);
        }

        // Extend payment_mode enum to include UPI (MySQL/MariaDB)
        $this->db->query("
            ALTER TABLE `payments`
            MODIFY `payment_mode`
            ENUM('Cash','Cheque','NEFT','UPI')
            NOT NULL
        ");
    }

    public function down()
    {
        // Revert enum to original values (without UPI)
        $this->db->query("
            ALTER TABLE `payments`
            MODIFY `payment_mode`
            ENUM('Cash','Cheque','NEFT')
            NOT NULL
        ");

        // Drop reference_no column
        if ($this->db->fieldExists('reference_no', 'payments')) {
            $this->forge->dropColumn('payments', 'reference_no');
        }
    }
}

