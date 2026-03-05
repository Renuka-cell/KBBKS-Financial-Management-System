<?php

namespace App\Models;

use CodeIgniter\Model;

class BillModel extends Model
{
    protected $table      = 'bills';
    protected $primaryKey = 'bill_id';

    protected $allowedFields = [
        'vendor_id',
        'bill_number',
        'bill_date',
        'bill_amount',
        'bill_file',
        'status'
    ];

    protected $returnType = 'array';

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = ''; // ✅ IMPORTANT FIX (NOT null)
}
