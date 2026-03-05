<?php

namespace App\Controllers;

use App\Models\PaymentModel;
use App\Models\BillModel;
use App\Models\LedgerModel;
use CodeIgniter\Database\Config;

class PaymentController extends BaseController
{
    /**
     * LIST ALL PAYMENTS
     * GET /payments/
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

        // 2️⃣ Fetch all payments
        $paymentModel = new PaymentModel();
        $payments = $paymentModel->select('payments.*, bills.bill_number, bills.vendor_id, vendors.vendor_name')
                                  ->join('bills', 'bills.bill_id = payments.bill_id')
                                  ->join('vendors', 'vendors.vendor_id = bills.vendor_id')
                                  ->findAll();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Payments retrieved successfully',
            'data'    => $payments
        ]);
    }

    /**
     * CREATE: Add new payment
     * URL: POST /payments/create
     */
    public function create()
    {
        // 1️⃣ Token check
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized access'
            ]);
        }

        // 2️⃣ Role check
        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Access denied'
            ]);
        }

        // 3️⃣ Read JSON body
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Invalid JSON request'
            ]);
        }

        $billId       = $data['bill_id'] ?? null;
        $amountPaid   = $data['amount_paid'] ?? null;
        $paymentDate  = $data['payment_date'] ?? null;
        $paymentMode  = $data['payment_mode'] ?? null;
        $referenceNo  = $data['reference_no'] ?? null;

        if (!$billId || !$amountPaid || !$paymentDate) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Missing required fields'
            ]);
        }

        $db = Config::connect();
        $db->transStart();

        // 3.1️⃣ Validate bill exists and read bill amount
        $billModel = new BillModel();
        $bill = $billModel->find($billId);
        if (!$bill) {
            $db->transComplete();
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Invalid bill_id'
            ]);
        }

        // 4️⃣ Insert payment
        $paymentModel = new PaymentModel();
        $paymentModel->insert([
            'bill_id'       => $billId,
            'amount_paid'   => $amountPaid,
            'payment_date'  => $paymentDate,
            'payment_mode'  => $paymentMode,
            'reference_no'  => $referenceNo
        ]);

        $paymentId = $paymentModel->getInsertID();

        // 5️⃣ Ledger entry
        $ledgerModel = new LedgerModel();
        $ledgerModel->insert([
            'reference_type' => 'Payment',
            'reference_id'   => $paymentId,
            'credit'         => $amountPaid,
            'debit'          => 0,
            'entry_date'     => $paymentDate
        ]);

        // 6️⃣ Update bill status based on total paid vs bill amount
        $totalPaidRow = $paymentModel
            ->select('COALESCE(SUM(amount_paid), 0) AS total_paid')
            ->where('bill_id', $billId)
            ->first();
        $totalPaid = (float)($totalPaidRow['total_paid'] ?? 0);
        $billAmount = (float)($bill['bill_amount'] ?? 0);

        $newStatus = ($billAmount > 0 && $totalPaid >= $billAmount) ? 'PAID' : 'UNPAID';
        $billModel->update($billId, ['status' => $newStatus]);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->response->setStatusCode(500)->setJSON([
                'status'  => false,
                'message' => 'Payment transaction failed'
            ]);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Payment recorded successfully'
        ]);
    }
}
