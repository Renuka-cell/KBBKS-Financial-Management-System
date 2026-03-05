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
     * Income vs Expense Report (Dashboard format)
     */
    public function getIncomeExpense()
    {
        $incomeResult = $this->db->table('invoices')
            ->select("SUM(invoice_amount) AS total_income")
            ->get()
            ->getRowArray();

        $expenseResult = $this->db->table('expenses')
            ->select("SUM(amount) AS total_expense")
            ->get()
            ->getRowArray();

        // Calculate total outstanding by summing bill amounts and subtracting total paid
        $billsResult = $this->db->table('bills')
            ->select("SUM(bill_amount) AS total_bills")
            ->get()
            ->getRowArray();

        $paymentsResult = $this->db->table('payments')
            ->select("SUM(amount_paid) AS total_paid")
            ->get()
            ->getRowArray();

        $totalBills = $billsResult['total_bills'] ?? 0;
        $totalPaid = $paymentsResult['total_paid'] ?? 0;
        $outstandingAmount = max(0, $totalBills - $totalPaid);

        return [
            'total_income' => $incomeResult['total_income'] ?? 0,
            'total_expense' => $expenseResult['total_expense'] ?? 0,
            'outstanding_amount' => $outstandingAmount
        ];
    }
}
