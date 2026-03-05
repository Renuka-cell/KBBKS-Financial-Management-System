<?php

namespace App\Models;

use CodeIgniter\Model;

class ReportModel extends Model
{

    /**
     * Vendor Outstanding Report
     */
    public function getVendorOutstanding()
    {
        return $this->db->query("
            SELECT 
                v.vendor_name,
                IFNULL(SUM(b.bill_amount), 0) AS total_bill,
                IFNULL(SUM(p.amount_paid), 0) AS paid_amount,
                (IFNULL(SUM(b.bill_amount), 0) - IFNULL(SUM(p.amount_paid), 0)) AS outstanding_amount
            FROM vendors v
            LEFT JOIN bills b ON b.vendor_id = v.vendor_id
            LEFT JOIN payments p ON p.bill_id = b.bill_id
            GROUP BY v.vendor_id
        ")->getResultArray();
    }

    /**
     * Monthly Expense Report
     */
    public function getMonthlyExpense()
    {
        return $this->db->table('expenses')
            ->select("DATE_FORMAT(expense_date, '%Y-%m') AS month, SUM(amount) AS total_expense")
            ->groupBy("DATE_FORMAT(expense_date, '%Y-%m')")
            ->orderBy("month", "DESC")
            ->get()
            ->getResultArray();
    }

    /**
     * Income vs Expense Report
     */
    public function getIncomeExpense()
    {
        return $this->db->query("
            SELECT 'Income' AS type, IFNULL(SUM(invoice_amount),0) AS total FROM invoices
            UNION ALL
            SELECT 'Expense' AS type, IFNULL(SUM(amount),0) AS total FROM expenses
        ")->getResultArray();
    }

    /**
     * Vendor Financial Summary (With Optional Filters)
     */
    public function getVendorSummary($vendor_id, $year = null, $month = null)
    {
        $vendor = $this->db->table('vendors')
            ->where('vendor_id', $vendor_id)
            ->get()
            ->getRowArray();

        if (!$vendor) {
            return null;
        }

        // convert logo path to full URL or default image
        if (!empty($vendor['logo'])) {
            $vendor['logo'] = base_url($vendor['logo']);
        } else {
            $vendor['logo'] = base_url('uploads/vendor_logos/default.png');
        }

        // Expense Builder
        $expenseBuilder = $this->db->table('expenses')
            ->where('vendor_id', $vendor_id);

        if (!empty($year)) {
            $expenseBuilder->where('YEAR(expense_date)', $year);
        }

        if (!empty($month)) {
            $expenseBuilder->where('MONTH(expense_date)', $month);
        }

        $totalExpense = $expenseBuilder
            ->selectSum('amount')
            ->get()
            ->getRow()
            ->amount ?? 0;

        // Bills Builder
        $billBuilder = $this->db->table('bills')
            ->where('vendor_id', $vendor_id);

        if (!empty($year)) {
            $billBuilder->where('YEAR(bill_date)', $year);
        }

        if (!empty($month)) {
            $billBuilder->where('MONTH(bill_date)', $month);
        }

        $totalBills = $billBuilder->countAllResults(false);

        $totalBillAmount = $billBuilder
            ->selectSum('bill_amount')
            ->get()
            ->getRow()
            ->bill_amount ?? 0;

        // Payment Builder
        $paymentBuilder = $this->db->table('payments')
            ->selectSum('amount_paid')
            ->join('bills', 'payments.bill_id = bills.bill_id')
            ->where('bills.vendor_id', $vendor_id);

        if (!empty($year)) {
            $paymentBuilder->where('YEAR(payment_date)', $year);
        }

        if (!empty($month)) {
            $paymentBuilder->where('MONTH(payment_date)', $month);
        }

        $totalPayment = $paymentBuilder
            ->get()
            ->getRow()
            ->amount_paid ?? 0;

        $outstanding = $totalBillAmount - $totalPayment;

        // Monthly Trend with optional filters
        $params = [$vendor_id];
        $expenseSql = "
            SELECT DATE_FORMAT(expense_date, '%Y-%m') as month,
                   SUM(amount) as total
            FROM expenses
            WHERE vendor_id = ?";
        if (!empty($year)) {
            $expenseSql .= " AND YEAR(expense_date) = ?";
            $params[] = $year;
        }
        if (!empty($month)) {
            $expenseSql .= " AND MONTH(expense_date) = ?";
            $params[] = $month;
        }
        $expenseSql .= "
            GROUP BY month
            ORDER BY month ASC";

        $monthlyExpense = $this->db->query($expenseSql, $params)->getResultArray();

        $paymentSql = "
            SELECT DATE_FORMAT(payment_date, '%Y-%m') as month,
                   SUM(amount_paid) as total
            FROM payments
            JOIN bills ON payments.bill_id = bills.bill_id
            WHERE bills.vendor_id = ?";
        $paymentParams = [$vendor_id];
        if (!empty($year)) {
            $paymentSql .= " AND YEAR(payment_date) = ?";
            $paymentParams[] = $year;
        }
        if (!empty($month)) {
            $paymentSql .= " AND MONTH(payment_date) = ?";
            $paymentParams[] = $month;
        }
        $paymentSql .= "
            GROUP BY month
            ORDER BY month ASC";

        $monthlyPayment = $this->db->query($paymentSql, $paymentParams)->getResultArray();

        // Detailed bills list for this vendor (for Vendor Profile view)
        $billsForVendor = $this->db->table('bills')
            ->where('vendor_id', $vendor_id)
            ->orderBy('bill_date', 'DESC')
            ->get()
            ->getResultArray();

        foreach ($billsForVendor as &$bill) {
            if (!empty($bill['bill_file'])) {
                $bill['bill_file_url'] = base_url($bill['bill_file']);
            } else {
                $bill['bill_file_url'] = null;
            }
        }

        return [
            'vendor_id' => $vendor_id,
            'vendor_name' => $vendor['vendor_name'],
            'logo' => $vendor['logo'],
            'year_filter' => $year,
            'month_filter' => $month,
            'total_expense' => (float)$totalExpense,
            'total_payment' => (float)$totalPayment,
            'outstanding_amount' => (float)$outstanding,
            'total_bills' => (int)$totalBills,
            'monthly_expense_trend' => $monthlyExpense,
            'monthly_payment_trend' => $monthlyPayment,
            'bills' => $billsForVendor,
        ];
    }

    /* ============================================================
       🔵 NEW DASHBOARD MODEL METHODS
    ============================================================ */

    /**
     * Dashboard KPI Summary
     */
    public function getDashboardSummary()
    {
        $totalIncome = $this->db->table('payments')
            ->selectSum('amount_paid')
            ->get()
            ->getRow()
            ->amount_paid ?? 0;

        $totalExpense = $this->db->table('expenses')
            ->selectSum('amount')
            ->get()
            ->getRow()
            ->amount ?? 0;

        $totalVendors = $this->db->table('vendors')
            ->countAllResults();

        $totalOutstanding = $this->db->query("
            SELECT 
                (IFNULL(SUM(b.bill_amount),0) - IFNULL(SUM(p.amount_paid),0)) AS outstanding
            FROM bills b
            LEFT JOIN payments p ON p.bill_id = b.bill_id
        ")->getRow()->outstanding ?? 0;

        return [
            'total_income' => (float)$totalIncome,
            'total_expense' => (float)$totalExpense,
            'net_balance' => (float)($totalIncome - $totalExpense),
            'total_vendors' => (int)$totalVendors,
            'total_outstanding' => (float)$totalOutstanding
        ];
    }

    /**
     * Monthly Income vs Expense Trend
     */
    public function getDashboardTrend()
    {
        $monthlyIncome = $this->db->query("
            SELECT DATE_FORMAT(payment_date, '%Y-%m') as month,
                   SUM(amount_paid) as total
            FROM payments
            GROUP BY month
            ORDER BY month ASC
        ")->getResultArray();

        $monthlyExpense = $this->db->query("
            SELECT DATE_FORMAT(expense_date, '%Y-%m') as month,
                   SUM(amount) as total
            FROM expenses
            GROUP BY month
            ORDER BY month ASC
        ")->getResultArray();

        return [
            'monthly_income' => $monthlyIncome,
            'monthly_expense' => $monthlyExpense
        ];
    }

    /**
     * Expense Category Distribution
     */
    public function getExpenseCategoryDistribution()
    {
        return $this->db->table('expenses')
            ->select('category, SUM(amount) as total')
            ->groupBy('category')
            ->get()
            ->getResultArray();
    }
}