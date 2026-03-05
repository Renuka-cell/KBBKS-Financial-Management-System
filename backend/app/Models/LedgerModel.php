<?php

namespace App\Models;

use CodeIgniter\Model;

class LedgerModel extends Model
{
    protected $table      = 'ledger';
    protected $primaryKey = 'ledger_id';

    protected $allowedFields = [
        'reference_type',
        'reference_id',
        'vendor_id',
        'debit',
        'credit',
        'entry_date'
    ];
}
?>
