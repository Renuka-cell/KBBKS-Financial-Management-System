<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddLogoToVendors extends Migration
{
    public function up()
    {
        $fields = [
            'logo' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'email',
            ],
        ];
        $this->forge->addColumn('vendors', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('vendors', 'logo');
    }
}
