<?php

namespace App\Controllers;

use App\Models\BillModel;
use App\Models\VendorModel;

class BillController extends BaseController
{
    /**
     * LIST ALL BILLS
     * GET /bills
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

        $billModel = new BillModel();
        return $this->response->setJSON([
            'status' => true,
            'data'   => $billModel->findAll()
        ]);
    }

    /**
     * GET SINGLE BILL
     * GET /bills/:id
     */
    public function view($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        $billModel = new BillModel();
        $bill = $billModel->find($id);

        if (!$bill) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Bill not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $bill
        ]);
    }

    /**
     * CREATE BILL
     * POST /bills
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

        // 2️⃣ Role check
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
            'status'      => $data['status'] ?? 'pending'
        ])) {
            return $this->response->setStatusCode(500)->setJSON([
                'status'  => false,
                'errors'  => $billModel->errors()
            ]);
        }

        // 7️⃣ Success response
        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Bill created successfully',
            'bill_id' => $billModel->getInsertID()
        ]);
    }

    /**
     * UPDATE BILL
     * PUT /bills/:id
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
                'message' => 'Only Admin and Accountant can update bills'
            ]);
        }

        $billModel = new BillModel();
        if (!$billModel->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Bill not found'
            ]);
        }

        $data = $this->request->getJSON(true);

        if (!$billModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => false,
                'errors' => $billModel->errors()
            ]);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Bill updated successfully'
        ]);
    }

    /**
     * DELETE BILL
     * DELETE /bills/:id
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
                'message' => 'Only Admin can delete bills'
            ]);
        }

        $billModel = new BillModel();
        if (!$billModel->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Bill not found'
            ]);
        }

        $billModel->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Bill deleted successfully'
        ]);
    }
}
