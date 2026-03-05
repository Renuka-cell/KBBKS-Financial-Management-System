<?php

namespace App\Controllers;

use App\Models\BillModel;
use App\Models\VendorModel;

class BillController extends BaseController
{
    /**
     * LIST ALL BILLS
     * GET /bills/
     * Access: Authenticated users
     */
    public function index()
    {
        // 1️⃣ Auth check
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        // 2️⃣ Optional filters:
        //    - pending bills only (for payment entry dropdown): GET /bills/?pending=1
        //    - filter by vendor: GET /bills/?vendor_id=123
        $pendingOnly = $this->request->getGet('pending');
        $vendorId    = $this->request->getGet('vendor_id');

        // 3️⃣ Fetch bills
        $billModel = new BillModel();
        $query = $billModel->select('bills.*, vendors.vendor_name, vendors.logo AS vendor_logo')
                           ->join('vendors', 'vendors.vendor_id = bills.vendor_id');

        if (!empty($vendorId)) {
            $query->where('bills.vendor_id', (int) $vendorId);
        }

        if ($pendingOnly === '1' || $pendingOnly === 1 || $pendingOnly === true) {
            // Pending = anything not PAID (covers UNPAID, PARTIAL, NULL)
            $query->groupStart()
                  ->where('bills.status !=', 'PAID')
                  ->orWhere('bills.status', null)
                  ->groupEnd();
        }

        $bills = $query->orderBy('bills.bill_date', 'DESC')->findAll();

        // convert logo paths to full URL or default image
        foreach ($bills as &$bill) {
            if (!empty($bill['vendor_logo'])) {
                $bill['vendor_logo'] = base_url($bill['vendor_logo']);
            } else {
                $bill['vendor_logo'] = base_url('uploads/vendor_logos/default.png');
            }

            // convert bill file path to full URL (if present)
            if (!empty($bill['bill_file'])) {
                $bill['bill_file_url'] = base_url($bill['bill_file']);
            } else {
                $bill['bill_file_url'] = null;
            }
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Bills retrieved successfully',
            'data'    => $bills
        ]);
    }

    /**
     * CREATE BILL
     * POST /bills/create
     * Access: Admin, Accountant
     */
    public function create()
    {
        // 1️⃣ Auth check
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        // 2️⃣ Role check (IMPORTANT FIX)
        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin and Accountant can create bills'
            ]);
        }

        // 3️⃣ Read JSON payload
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Invalid JSON'
            ]);
        }

        // 4️⃣ Required fields validation
        if (
            empty($data['vendor_id']) ||
            empty($data['bill_number']) ||
            empty($data['bill_date']) ||
            empty($data['bill_amount'])
        ) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Missing required fields'
            ]);
        }

        // 5️⃣ Validate vendor existence
        $vendorModel = new VendorModel();
        if (!$vendorModel->find($data['vendor_id'])) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Invalid vendor_id'
            ]);
        }

        // 6️⃣ Insert bill
        $billModel = new BillModel();

        if (!$billModel->insert([
            'vendor_id'   => $data['vendor_id'],
            'bill_number' => $data['bill_number'],
            'bill_date'   => $data['bill_date'],
            'bill_amount' => $data['bill_amount'],
            'status'      => 'UNPAID'
        ])) {
            return $this->response->setStatusCode(500)->setJSON([
                'status'  => false,
                'errors'  => $billModel->errors()
            ]);
        }

        // 7️⃣ Success response (UNCHANGED)
        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Bill created successfully',
            'bill_id' => $billModel->getInsertID()
        ]);
    }
}
