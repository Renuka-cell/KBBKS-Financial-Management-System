<?php

namespace App\Controllers;

use App\Models\PaymentModel;
use App\Models\LedgerModel;
use App\Models\BillModel;
use CodeIgniter\Database\Config;

class PaymentController extends BaseController
{
    /**
     * LIST ALL PAYMENTS
     * GET /payments
     */
    public function index()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant', 'Viewer'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Insufficient permissions'
            ]);
        }

        $paymentModel = new PaymentModel();
        return $this->response->setJSON([
            'status' => true,
            'data'   => $paymentModel->findAll()
        ]);
    }

    /**
     * GET SINGLE PAYMENT
     * GET /payments/:id
     */
    public function view($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        $paymentModel = new PaymentModel();
        $payment = $paymentModel->find($id);

        if (!$payment) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Payment not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $payment
        ]);
    }

    /**
     * CREATE: Add new payment
     * POST /payments
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

        if (!$billId || !$amountPaid || !$paymentDate) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Missing required fields'
            ]);
        }

        $db = Config::connect();
        $db->transStart();

        // 4️⃣ Get bill to retrieve vendor_id
        $billModel = new BillModel();
        $bill = $billModel->find($billId);
        
        if (!$bill) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Bill not found'
            ]);
        }

        // 5️⃣ Insert payment
        $paymentModel = new PaymentModel();
        $paymentModel->insert([
            'bill_id'       => $billId,
            'amount_paid'   => $amountPaid,
            'payment_date'  => $paymentDate,
            'payment_mode'  => $paymentMode
        ]);

        $paymentId = $paymentModel->getInsertID();

        // 6️⃣ Ledger entry with vendor_id
        $ledgerModel = new LedgerModel();
        $ledgerModel->insert([
            'reference_type' => 'Payment',
            'reference_id'   => $paymentId,
            'vendor_id'      => $bill['vendor_id'],
            'credit'         => $amountPaid,
            'debit'          => 0,
            'entry_date'     => $paymentDate
        ]);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->response->setStatusCode(500)->setJSON([
                'status'  => false,
                'message' => 'Payment transaction failed'
            ]);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Payment recorded successfully',
            'payment_id' => $paymentId
        ]);
    }

    /**
     * UPDATE PAYMENT
     * PUT /payments/:id
     */
    public function update($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin and Accountant can update payments'
            ]);
        }

        $paymentModel = new PaymentModel();
        if (!$paymentModel->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Payment not found'
            ]);
        }

        $data = $this->request->getJSON(true);

        if (!$paymentModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => false,
                'errors' => $paymentModel->errors()
            ]);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Payment updated successfully'
        ]);
    }

    /**
     * DELETE PAYMENT
     * DELETE /payments/:id
     */
    public function delete($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin can delete payments'
            ]);
        }

        $paymentModel = new PaymentModel();
        if (!$paymentModel->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Payment not found'
            ]);
        }

        $paymentModel->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Payment deleted successfully'
        ]);
    }
}
