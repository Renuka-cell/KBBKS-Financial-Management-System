<?php

namespace App\Models;

use CodeIgniter\Model;

class PaymentModel extends Model
{
    protected $table      = 'payments';
    protected $primaryKey = 'payment_id';

    protected $allowedFields = [
        'bill_id',
        'payment_date',
        'amount_paid',
        'payment_mode',
        'payment_mode',
        'reference_no',
        'instrument_file'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = ''; // ✅ IMPORTANT FIX
}
