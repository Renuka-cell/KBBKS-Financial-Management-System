<?php

namespace App\Controllers;

use App\Models\ExpenseModel;
use App\Models\LedgerModel;
use App\Models\BillModel;

class ExpenseController extends BaseController
{
    /**
     * LIST ALL EXPENSES
     * GET /expenses
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

        $expenseModel = new ExpenseModel();
        return $this->response->setJSON([
            'status' => true,
            'data'   => $expenseModel->findAll()
        ]);
    }

    /**
     * GET SINGLE EXPENSE
     * GET /expenses/:id
     */
    public function view($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        $expenseModel = new ExpenseModel();
        $expense = $expenseModel->find($id);

        if (!$expense) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Expense not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $expense
        ]);
    }

    /**
     * CREATE: Insert new expense
     * POST /expenses
     * Roles: Admin, Accountant
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

        // 3️⃣ Read JSON body ONLY
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Invalid JSON request'
            ]);
        }

        // 4️⃣ Extract values SAFELY
        $vendorId    = $data['vendor_id'] ?? null;
        $amount      = $data['amount'] ?? null;
        $category    = $data['category'] ?? null;
        $expenseDate = $data['expense_date'] ?? null;
        $description = $data['description'] ?? null;

        // 5️⃣ Validation
        if (!$vendorId || !$amount || !$expenseDate) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Invalid data'
            ]);
        }

        // 6️⃣ Insert into expenses table
        $expenseModel = new ExpenseModel();
        $expenseInserted = $expenseModel->insert([
            'vendor_id'    => $vendorId,
            'amount'       => $amount,
            'category'     => $category,
            'expense_date' => $expenseDate,
            'description'  => $description
        ]);

        if (!$expenseInserted) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => false,
                'errors' => $expenseModel->errors()
            ]);
        }

        $expenseId = $expenseModel->getInsertID();

        // 7️⃣ Auto-create a corresponding bill for payment tracking
        $billModel = new BillModel();
        $billModel->insert([
            'vendor_id'   => $vendorId,
            'bill_number' => 'EXP-' . $expenseId,
            'bill_date'   => $expenseDate,
            'bill_amount' => $amount,
            'status'      => 'pending'
        ]);

        // 8️⃣ Update Ledger
        $ledgerModel = new LedgerModel();
        $ledgerModel->insert([
            'reference_type' => 'EXPENSE',
            'reference_id'   => $expenseId,
            'vendor_id'      => $vendorId,
            'debit'          => $amount,
            'credit'         => 0,
            'entry_date'     => $expenseDate
        ]);

        return $this->response->setJSON([
            'status'      => true,
            'message'     => 'Expense created successfully',
            'expense_id'  => $expenseId
        ]);
    }

    /**
     * UPDATE EXPENSE
     * PUT /expenses/:id
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
                'message' => 'Only Admin and Accountant can update expenses'
            ]);
        }

        $expenseModel = new ExpenseModel();
        if (!$expenseModel->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Expense not found'
            ]);
        }

        $data = $this->request->getJSON(true);

        if (!$expenseModel->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => false,
                'errors' => $expenseModel->errors()
            ]);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Expense updated successfully'
        ]);
    }

    /**
     * DELETE EXPENSE
     * DELETE /expenses/:id
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
                'message' => 'Only Admin can delete expenses'
            ]);
        }

        $expenseModel = new ExpenseModel();
        if (!$expenseModel->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Expense not found'
            ]);
        }

        $expenseModel->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Expense deleted successfully'
        ]);
    }
}

