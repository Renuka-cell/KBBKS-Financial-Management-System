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
        // Token check
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
     * Roles: Admin, Accountant, Viewer
     */
    public function monthlyExpense()
    {
        // Token check
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
     * Roles: Admin, Accountant, Viewer
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
}
