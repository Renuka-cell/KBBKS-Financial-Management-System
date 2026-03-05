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
     * Roles: Admin, Accountant
     */
    public function dashboardSummary()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => false,
                'message' => 'Only Admin and Accountant can access dashboard summary'
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
     * Roles: Admin, Accountant
     */
    public function dashboardTrend()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => false,
                'message' => 'Only Admin and Accountant can access dashboard trend'
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
     * Roles: Admin, Accountant
     */
    public function expenseCategoryDistribution()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => false,
                'message' => 'Unauthorized'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => false,
                'message' => 'Only Admin and Accountant can access category distribution'
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