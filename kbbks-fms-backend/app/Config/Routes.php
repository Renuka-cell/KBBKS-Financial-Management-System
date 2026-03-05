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
| API ROUTES (All routes under /api prefix)
|--------------------------------------------------------------------------
*/
$routes->group('api', function ($routes) {
    // Handle OPTIONS preflight for all API routes
    $routes->options('(:any)', static function() {});

    /*
    |------------------------------------------------------
    | AUTH ROUTES
    |------------------------------------------------------
    */
    $routes->group('auth', function ($routes) {
        $routes->post('login', 'AuthController::login');
        $routes->post('register', 'AuthController::register');
    });

    /*
    |------------------------------------------------------
    | VENDOR ROUTES
    |------------------------------------------------------
    */
    $routes->group('vendors', function ($routes) {
        $routes->get('/', 'VendorController::index');
        $routes->post('/', 'VendorController::create');
        $routes->get('(:num)', 'VendorController::view/$1');
        $routes->put('(:num)', 'VendorController::update/$1');
        $routes->delete('(:num)', 'VendorController::delete/$1');
    });

    /*
    |------------------------------------------------------
    | BILL ROUTES
    |------------------------------------------------------
    */
    $routes->group('bills', function ($routes) {
        $routes->get('/', 'BillController::index');
        $routes->post('/', 'BillController::create');
        $routes->get('(:num)', 'BillController::view/$1');
        $routes->put('(:num)', 'BillController::update/$1');
        $routes->delete('(:num)', 'BillController::delete/$1');
    });

    /*
    |------------------------------------------------------
    | EXPENSE ROUTES
    |------------------------------------------------------
    */
    $routes->group('expenses', function ($routes) {
        $routes->get('/', 'ExpenseController::index');
        $routes->post('/', 'ExpenseController::create');
        $routes->get('(:num)', 'ExpenseController::view/$1');
        $routes->put('(:num)', 'ExpenseController::update/$1');
        $routes->delete('(:num)', 'ExpenseController::delete/$1');
    });

    /*
    |------------------------------------------------------
    | PAYMENT ROUTES
    |------------------------------------------------------
    */
    $routes->group('payments', function ($routes) {
        $routes->get('/', 'PaymentController::index');
        $routes->post('/', 'PaymentController::create');
        $routes->get('(:num)', 'PaymentController::view/$1');
        $routes->put('(:num)', 'PaymentController::update/$1');
        $routes->delete('(:num)', 'PaymentController::delete/$1');
    });

    /*
    |------------------------------------------------------
    | REPORT ROUTES
    |------------------------------------------------------
    */
    $routes->group('reports', function ($routes) {
        $routes->get('vendor-outstanding', 'ReportController::vendorOutstanding');
        $routes->get('monthly-expense', 'ReportController::monthlyExpense');
        $routes->get('income-expense', 'ReportController::incomeExpense');
    });

});
