<?php

namespace App\Models;

use CodeIgniter\Model;

class ExpenseModel extends Model
{
    protected $table      = 'expenses';
    protected $primaryKey = 'expense_id';

    protected $allowedFields = [
        'expense_date',
        'vendor_id',
        'amount',
        'category',
        'description',
        'bill_file',
        'created_at'
    ];

    protected $returnType = 'array';

    // Timestamp handling (ONLY created_at)
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = ''; // ✅ IMPORTANT: empty string, not null

    protected $validationRules = [
        'vendor_id'    => 'required|integer',
        'amount'       => 'required|decimal',
        'expense_date' => 'required|valid_date'
    ];
}
