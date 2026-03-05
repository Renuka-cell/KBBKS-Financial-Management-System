<?php

namespace App\Models;

use CodeIgniter\Model;

class InvoiceModel extends Model
{
    protected $table      = 'invoices';
    protected $primaryKey = 'invoice_id';

    protected $allowedFields = [
        'invoice_number',
        'invoice_date',
        'amount',
        'received_status'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
}
