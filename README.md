# KBBKS Financial Management System (FMS)

A **full-stack financial management system** designed for NGOs and small
organizations to digitally manage **vendors, expenses, payments, and
financial reports**.

This system replaces manual bookkeeping with a **secure, web-based
solution** that provides real-time financial insights and organized
vendor management.

------------------------------------------------------------------------

# 🚀 Project Overview

**Modules Implemented**

-   Vendor Management
-   Expense Tracking
-   Payment Processing
-   Financial Dashboard
-   Reports & Analytics
-   Role-based Authentication

------------------------------------------------------------------------

# 🏗️ Tech Stack

## Backend

-   PHP 8.2
-   CodeIgniter 4
-   MySQL
-   REST API
-   Token-based Authentication

## Frontend

-   React
-   Vite
-   Axios
-   Context API
-   CSS

------------------------------------------------------------------------

# 📂 Project Structure

```
KBBKS-Financial-Management-System
│
├── backend       # CodeIgniter Backend
│
├── frontend         # React Frontend
│
├── README.md
└── upload_test.py
```

---
------------------------------------------------------------------------

# ✨ Features

## Vendor Management

-   Add new vendors
-   Edit vendor information
-   Delete vendors
-   Vendor profile overview

## Expense Management

-   Record expenses
-   Categorize expenses
-   Automatic bill generation
-   Expense history tracking

## Payment System

-   Record vendor payments
-   Multiple payment modes
-   Payment reference tracking
-   Pending bill filtering

## Dashboard Analytics

-   Total Expenses
-   Total Payments
-   Outstanding Amount
-   Monthly Financial Trends

------------------------------------------------------------------------

# 🔐 User Roles

  Role         Dashboard   Vendor   Expense   Payment
  ------------ ----------- -------- --------- ---------
  Admin        ✅          ✅       ✅        ✅
  Accountant   ✅          ❌       ✅        ✅
  Viewer       ✅          ❌       ❌        ❌

------------------------------------------------------------------------

# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

git clone
https://github.com/Omkar0-0/KBBKS-Financial-Management-System.git cd
KBBKS-Financial-Management-System

------------------------------------------------------------------------

# 🗄️ Database Setup

Create a database in MySQL:

CREATE DATABASE fms_db;

Import the database file:

mysql -u root -p fms_db \< fms_db.sql

OR import **fms_db.sql** using phpMyAdmin.

------------------------------------------------------------------------

# Backend Setup

cd teammate-backend composer install php spark serve --port=8080

Backend will run at:

http://localhost:8080

------------------------------------------------------------------------

# Frontend Setup

Open a new terminal.

cd kbbks-fms-frontend npm install npm run dev

Frontend will run at:

http://localhost:5174

------------------------------------------------------------------------

# 🧪 Demo Login Credentials

Email: admin@test.com\
Password: password123

------------------------------------------------------------------------

# 🌐 API Endpoints

## Authentication

POST /api/auth/register\
POST /api/auth/login

## Vendors

GET /api/vendors\
POST /api/vendors\
GET /api/vendors/:id\
PUT /api/vendors/:id\
DELETE /api/vendors/:id

## Expenses

GET /api/expenses\
POST /api/expenses\
PUT /api/expenses/:id\
DELETE /api/expenses/:id

## Payments

GET /api/payments\
POST /api/payments\
PUT /api/payments/:id\
DELETE /api/payments/:id

## Reports

GET /api/reports/income-expense\
GET /api/reports/vendor-outstanding\
GET /api/reports/monthly-expense

------------------------------------------------------------------------

# 📊 Example Workflow

1.  Login as Admin
2.  Create a Vendor
3.  Record an Expense
4.  Bill gets auto-generated
5.  Record Payment against the bill
6.  Dashboard updates financial statistics

------------------------------------------------------------------------

# 🔒 Security Features

-   Password hashing with bcrypt
-   Token-based authentication
-   Input validation (Frontend + Backend)
-   SQL injection protection
-   CORS protection
-   Database transactions

------------------------------------------------------------------------

# 🐛 Troubleshooting

### MySQL connection error

Ensure MySQL service is running.

### CORS error

Check backend server is running on **port 8080**.

### Vendors not showing in expense entry

Create vendors first in **Vendor Master**.

------------------------------------------------------------------------

# 📄 License

This project is developed for **learning and academic purposes**.
