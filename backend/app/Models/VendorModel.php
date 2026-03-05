<?php

namespace App\Models;

use CodeIgniter\Model;

class VendorModel extends Model
{
    protected $table      = 'vendors';
    protected $primaryKey = 'vendor_id';

    // Always return array (API friendly)
    protected $returnType = 'array';

    // Fields allowed for insert & update
    protected $allowedFields = [
        'vendor_name',
        'contact_person',
        'phone',
        'email',
        'logo' // ✅ NEW FIELD ADDED (Vendor Logo Support)
    ];

    // IMPORTANT: Disable timestamps (fixes 500 error)
    protected $useTimestamps = false;

    // Validation rules
    protected $validationRules = [
        'vendor_name' => 'required|min_length[3]',
        'phone'       => 'permit_empty|numeric|min_length[10]|max_length[15]',
        'email'       => 'permit_empty|valid_email'
        // Logo validation handled in controller (file upload validation)
    ];

    protected $validationMessages = [
        'vendor_name' => [
            'required' => 'Vendor name is required'
        ],
        'email' => [
            'valid_email' => 'Invalid email format'
        ]
    ];
}