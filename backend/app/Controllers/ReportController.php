<?php

namespace App\Controllers;

use App\Models\ReportModel;

class ReportController extends BaseController
{
    /**
     * GET /reports/vendor-outstanding
     * Roles: Admin, Accountant, Viewer
     */
    public function vendorOutstanding()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        $reportModel = new ReportModel();
        $data = $reportModel->getVendorOutstanding();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data
        ]);
    }

    /**
     * GET /reports/monthly-expense
     */
    public function monthlyExpense()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        $reportModel = new ReportModel();
        $data = $reportModel->getMonthlyExpense();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data
        ]);
    }

    /**
     * GET /reports/income-expense
     */
    public function incomeExpense()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized'
            ]);
        }

        $reportModel = new ReportModel();
        $data = $reportModel->getIncomeExpense();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data
        ]);
    }

    /**
     * DOWNLOAD: All expenses as CSV/Excel
     * GET /reports/expenses-export
     * Roles: Admin, Accountant
     */
    public function expensesExport()
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
                'message' => 'Only Admin and Accountant can download expense report'
            ]);
        }

        $db = \Config\Database::connect();
        $builder = $db->table('expenses e')
            ->select('e.expense_date, e.vendor_id, v.vendor_name, e.amount, e.category, e.description')
            ->join('vendors v', 'v.vendor_id = e.vendor_id', 'left');

        $rows = $builder->orderBy('e.expense_date', 'DESC')->get()->getResultArray();

        $filename = 'expenses-' . date('Ymd-His') . '.csv';

        $csv = [];
        $csv[] = ['Expense Date', 'Vendor ID', 'Vendor Name', 'Category', 'Amount', 'Description'];

        foreach ($rows as $row) {
            $csv[] = [
                $row['expense_date'],
                $row['vendor_id'],
                $row['vendor_name'],
                $row['category'],
                $row['amount'],
                $row['description'],
            ];
        }

        $fh = fopen('php://temp', 'r+');
        foreach ($csv as $line) {
            fputcsv($fh, $line);
        }
        rewind($fh);
        $output = stream_get_contents($fh);
        fclose($fh);

        return $this->response
            ->setHeader('Content-Type', 'application/vnd.ms-excel')
            ->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
            ->setBody($output);
    }

    /**
     * DOWNLOAD: All payments as CSV/Excel
     * GET /reports/payments-export
     * Roles: Admin, Accountant
     */
    public function paymentsExport()
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
                'message' => 'Only Admin and Accountant can download payment report'
            ]);
        }

        $db = \Config\Database::connect();
        $builder = $db->table('payments p')
            ->select('p.payment_date, p.bill_id, p.amount_paid, p.payment_mode, b.vendor_id, v.vendor_name')
            ->join('bills b', 'b.bill_id = p.bill_id', 'left')
            ->join('vendors v', 'v.vendor_id = b.vendor_id', 'left');

        $rows = $builder->orderBy('p.payment_date', 'DESC')->get()->getResultArray();

        $filename = 'payments-' . date('Ymd-His') . '.csv';

        $csv = [];
        $csv[] = ['Payment Date', 'Bill ID', 'Vendor ID', 'Vendor Name', 'Payment Mode', 'Amount Paid'];

        foreach ($rows as $row) {
            $csv[] = [
                $row['payment_date'],
                $row['bill_id'],
                $row['vendor_id'],
                $row['vendor_name'],
                $row['payment_mode'],
                $row['amount_paid'],
            ];
        }

        $fh = fopen('php://temp', 'r+');
        foreach ($csv as $line) {
            fputcsv($fh, $line);
        }
        rewind($fh);
        $output = stream_get_contents($fh);
        fclose($fh);

        return $this->response
            ->setHeader('Content-Type', 'application/vnd.ms-excel')
            ->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
            ->setBody($output);
    }

    /**
     * GET /reports/vendor-summary/{vendor_id}
     */
    public function vendorSummary($vendor_id)
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
                'message' => 'Only Admin and Accountant can access vendor summary'
            ]);
        }

        $year  = $this->request->getGet('year') ?? null;
        $month = $this->request->getGet('month') ?? null;

        $reportModel = new ReportModel();
        $data = $reportModel->getVendorSummary($vendor_id, $year, $month);

        if ($data === null) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Vendor not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data
        ]);
    }

    /* ============================================================
       🔵 NEW DASHBOARD ANALYTICS APIs
    ============================================================ */

    /**
     * GET /reports/dashboard-summary
     * Roles: Admin, Accountant, Viewer
     */
    public function dashboardSummary()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant', 'Viewer'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => false,
                'message' => 'Only Admin, Accountant or Viewer can access dashboard summary'
            ]);
        }

        $reportModel = new ReportModel();
        $data = $reportModel->getDashboardSummary();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data
        ]);
    }

    /**
     * GET /reports/dashboard-trend
     * Roles: Admin, Accountant, Viewer
     */
    public function dashboardTrend()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant', 'Viewer'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => false,
                'message' => 'Only Admin, Accountant or Viewer can access dashboard trend'
            ]);
        }

        $reportModel = new ReportModel();
        $data = $reportModel->getDashboardTrend();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data
        ]);
    }

    /**
     * GET /reports/expense-category-distribution
     * Roles: Admin, Accountant, Viewer
     */
    public function expenseCategoryDistribution()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant', 'Viewer'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => false,
                'message' => 'Only Admin, Accountant or Viewer can access category distribution'
            ]);
        }

        $reportModel = new ReportModel();
        $data = $reportModel->getExpenseCategoryDistribution();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $data
        ]);
    }
}