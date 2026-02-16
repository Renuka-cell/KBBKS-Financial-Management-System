<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateLedgersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'ledger_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'reference_type' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => false,
            ],
            'reference_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => false,
            ],
            'vendor_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => false,
            ],
            'debit' => [
                'type'       => 'DECIMAL',
                'constraint' => '12,2',
                'default'    => 0,
            ],
            'credit' => [
                'type'       => 'DECIMAL',
                'constraint' => '12,2',
                'default'    => 0,
            ],
            'entry_date' => [
                'type'   => 'DATE',
                'null'   => false,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('ledger_id', true);
        $this->forge->addForeignKey('vendor_id', 'vendors', 'vendor_id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('ledgers');
    }

    public function down()
    {
        $this->forge->dropTable('ledgers');
    }
}
