<?php

namespace App\Controllers;

use App\Models\ExpenseModel;
use App\Models\LedgerModel;
use App\Models\BillModel;

class ExpenseController extends BaseController
{
    /**
     * LIST ALL EXPENSES
     * GET /expenses/
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

        // 2️⃣ Fetch all expenses
        $expenseModel = new ExpenseModel();
        $expenses = $expenseModel->select('expenses.*, vendors.vendor_name')
                                  ->join('vendors', 'vendors.vendor_id = expenses.vendor_id')
                                  ->findAll();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Expenses retrieved successfully',
            'data'    => $expenses
        ]);
    }

    /**
     * CREATE: Insert new expense
     * URL: POST /expenses/create
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

        // 3️⃣ Read request body (JSON or form-data with optional file)
        $contentType = $this->request->getHeaderLine('Content-Type');
        $isJson = strpos($contentType, 'application/json') !== false;

        if ($isJson) {
            $data = $this->request->getJSON(true);
            $file = null;

            if (!$data) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status'  => false,
                    'message' => 'Invalid JSON request'
                ]);
            }
        } else {
            $data = $this->request->getPost();
            $file = $this->request->getFile('bill_file');

            if (!$data) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status'  => false,
                    'message' => 'Invalid form request'
                ]);
            }
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

        // 6️⃣ Handle optional bill file upload (image/PDF, max 2MB)
        $billFilePath = null;

        if (isset($file) && $file && $file->isValid() && !$file->hasMoved()) {
            // 2MB size limit
            if ($file->getSize() > 2 * 1024 * 1024) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status'  => false,
                    'message' => 'Bill file size must be less than or equal to 2MB'
                ]);
            }

            // Allowed extensions
            $allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf'];
            $extension = strtolower($file->getExtension());

            if (!in_array($extension, $allowedExtensions)) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status'  => false,
                    'message' => 'Only PNG, JPG, JPEG or PDF bill files are allowed'
                ]);
            }

            $newName = $file->getRandomName();
            $targetDir = FCPATH . 'uploads/bills/';
            if (!is_dir($targetDir)) {
                @mkdir($targetDir, 0755, true);
            }

            if (!$file->move($targetDir, $newName)) {
                return $this->response->setStatusCode(500)->setJSON([
                    'status'  => false,
                    'message' => 'Failed to save bill file'
                ]);
            }

            $billFilePath = 'uploads/bills/' . $newName;
        }

        // 7️⃣ Insert into expenses table
        $expenseModel = new ExpenseModel();
        $expenseInserted = $expenseModel->insert([
            'vendor_id'    => $vendorId,
            'amount'       => $amount,
            'category'     => $category,
            'expense_date' => $expenseDate,
            'description'  => $description,
            'bill_file'    => $billFilePath
        ]);

        if (!$expenseInserted) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'errors'  => $expenseModel->errors()
            ]);
        }

        $expenseId = $expenseModel->getInsertID();

        // 8️⃣ Insert ledger entry
        $ledgerModel = new LedgerModel();
        $ledgerInserted = $ledgerModel->insert([
            'vendor_id'      => $vendorId,
            'reference_type' => 'Expense',
            'reference_id'   => $expenseId,
            'debit'          => $amount,
            'credit'         => 0,
            'entry_date'     => $expenseDate
        ]);

        if (!$ledgerInserted) {
            return $this->response->setStatusCode(500)->setJSON([
                'status'  => false,
                'message' => 'Ledger insert failed'
            ]);
        }

        // 9️⃣ Auto-create a bill for this expense (link bill_file if present)
        $billModel = new BillModel();
        $billData = [
            'vendor_id'   => $vendorId,
            'bill_number' => 'EXP-' . $expenseId,
            'bill_date'   => $expenseDate,
            'bill_amount' => $amount,
            'status'      => 'UNPAID',
            'bill_file'   => $billFilePath
        ];
        $billModel->insert($billData);

        // 🔟 Success
        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Expense recorded, ledger updated and bill created',
            'expense_id' => $expenseId,
            'bill_number' => $billData['bill_number']
        ]);
    }
}
