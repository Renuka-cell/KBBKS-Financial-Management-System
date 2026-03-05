<?php

use CodeIgniter\Router\RouteCollection;
use Config\Services;

/**
 * @var RouteCollection $routes
 */
$routes = Services::routes();

/*
|--------------------------------------------------------------------------
| Router Setup
|--------------------------------------------------------------------------
*/
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();

/*
|--------------------------------------------------------------------------
| Basic Routes
|--------------------------------------------------------------------------
*/
$routes->get('/', 'Home::index');

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
$routes->group('auth', function ($routes) {

    $routes->post('login', 'AuthController::login');
    $routes->post('register', 'AuthController::register');

});

/*
|--------------------------------------------------------------------------
| VENDOR ROUTES
|--------------------------------------------------------------------------
*/
$routes->group('vendors', function ($routes) {

    $routes->get('/', 'VendorController::index');          // List vendors
    $routes->post('create', 'VendorController::create');   // Create vendor
    $routes->post('update/(:num)', 'VendorController::update/$1');
    $routes->get('delete/(:num)', 'VendorController::delete/$1');

});

/*
|--------------------------------------------------------------------------
| BILL ROUTES
|--------------------------------------------------------------------------
*/
$routes->group('bills', function ($routes) {

    $routes->get('/', 'BillController::index');            // List bills
    $routes->post('create', 'BillController::create');     // Create bill

});

/*
|--------------------------------------------------------------------------
| EXPENSE ROUTES
|--------------------------------------------------------------------------
*/
$routes->group('expenses', function ($routes) {

    $routes->get('/', 'ExpenseController::index');         // List expenses
    $routes->post('create', 'ExpenseController::create');  // Add expense

});

/*
|--------------------------------------------------------------------------
| PAYMENT ROUTES
|--------------------------------------------------------------------------
*/
$routes->group('payments', function ($routes) {

    $routes->get('/', 'PaymentController::index');         // List payments
    $routes->post('create', 'PaymentController::create');  // Add payment

});

/*
|--------------------------------------------------------------------------
| REPORT ROUTES
|--------------------------------------------------------------------------
*/
$routes->group('reports', function ($routes) {

    // ✅ Vendor Outstanding Report
    $routes->get('vendor-outstanding', 'ReportController::vendorOutstanding');

    // Monthly Expense Report
    $routes->get('monthly-expense', 'ReportController::monthlyExpense');

    // Income vs Expense Report
    $routes->get('income-expense', 'ReportController::incomeExpense');

    // ✅ Vendor Financial Summary (Vendor Master Analytics)
    $routes->get('vendor-summary/(:num)', 'ReportController::vendorSummary/$1');

    /* ============================================================
       🔵 NEW DASHBOARD ANALYTICS ROUTES
    ============================================================ */

    // 🔵 Dashboard KPI Summary
    $routes->get('dashboard-summary', 'ReportController::dashboardSummary');

    // 🔵 Monthly Income vs Expense Trend
    $routes->get('dashboard-trend', 'ReportController::dashboardTrend');

    // 🔵 Expense Category Distribution
    $routes->get('expense-category-distribution', 'ReportController::expenseCategoryDistribution');

});