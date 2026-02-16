# KBBKS Financial Management System (FMS)

A comprehensive web-based financial management solution designed for NGOs and small organizations to digitally manage expenses, vendor payments, and financial reporting.

**Status:** ✅ Production Ready (v1.0)

---

## 🎯 Features

### Core Functionality
- **👥 Vendor Management** - Create, view, edit, and delete vendor records
- **📝 Expense Tracking** - Record and categorize expenses with automatic bill generation
- **💳 Payment Processing** - Record vendor payments with multiple payment modes
- **📊 Financial Dashboard** - Real-time income, expense, and outstanding amount tracking
- **📈 Reports** - Vendor outstanding analysis, monthly expense breakdown

### Security
- **🔐 Role-based Access Control** - Admin, Accountant, Viewer roles
- **🛡️ Token-based Authentication** - Secure JWT-like token system
- **📋 Comprehensive Validation** - Frontend and backend validation for all inputs
- **🔒 Database Integrity** - Foreign keys, transactions, constraints

---

## 🏗️ Tech Stack

### Backend
- **PHP 8.2** with CodeIgniter 4
- **MySQL 5.7+**
- **REST API** with JSON responses
- **Token-based Authentication**

### Frontend
- **React 19**
- **Vite** (development server)
- **Axios** HTTP client
- **Context API** for state management

---

## 📋 Prerequisites

Before you start, ensure you have:
- **PHP 8.1+** installed with MySQL extensions
- **MySQL 5.7+** running and accessible
- **Node.js 16+** and npm
- **Composer** (for PHP dependencies)

### Check Your Environment
```bash
# Check PHP version
php --version

# Check Node version
node --version
npm --version

# Check if MySQL is running (Windows)
mysql -u root -p -e "SELECT 1"
```

---

## 🚀 Quick Start (Complete Setup)

### 1️⃣ Clone Repository and Navigate to Project
```bash
cd c:\Users\omi\Desktop\fms
```

### 2️⃣ Database Setup

#### Windows - Using Command Line
```bash
# Start MySQL service (if not running)
Start-Service MySQL80

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS fms_db;"

# Verify
mysql -u root -e "SHOW DATABASES;"
```

#### Alternative - Using MySQL Workbench
1. Open MySQL Workbench
2. Connect with `root` user
3. Execute: `CREATE DATABASE IF NOT EXISTS fms_db;`

### 3️⃣ Backend Setup

```bash
# Navigate to backend
cd kbbks-fms-backend

# Install PHP dependencies
composer install

# Run database migrations (creates tables)
php spark migrate

# Verify tables were created
php spark db:seed --file="app\Database\Seeds\InitialDataSeeder" # Optional: adds sample data

# Start backend server
php spark serve --port=8080
```

**Backend runs at:** `http://localhost:8080`

### 4️⃣ Frontend Setup

Open a **new terminal/PowerShell window**:

```bash
# Navigate to frontend
cd kbbks-fms-frontend

# Install Node dependencies
npm install

# Create .env file (if not exists)
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env

# Start development server
npm run dev
```

**Frontend runs at:** `http://localhost:5174`

### 5️⃣ Access the Application

1. Open browser: **http://localhost:5174**
2. You should see the Login page

---

## 👤 Default Test Users

After running migrations, you can test with:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | password123 | Admin |
| accountant@test.com | password123 | Accountant |
| viewer@test.com | password123 | Viewer |

### Try This Workflow
1. **Login** as Admin with `admin@test.com` / `password123`
2. **Create Vendor** - Go to "Vendor Master", add a vendor
3. **Record Expense** - Go to "Expense Entry", select vendor, enter amount
   - A bill is automatically created (named "EXP-{number}")
4. **Record Payment** - Go to "Payment Entry", select the auto-generated bill, enter payment
5. **View Dashboard** - Click refresh button to see updated stats

---

## 📁 Project Structure

```
KBBKS-FMS/
├── README.md (this file)
├── kbbks-fms-backend/          # CodeIgniter 4 PHP Backend
│   ├── app/
│   │   ├── Controllers/        # API controllers (Auth, Vendor, Expense, etc.)
│   │   ├── Models/             # Database models
│   │   ├── Database/
│   │   │   └── Migrations/     # Database schema (7 tables)
│   │   └── Config/
│   │       ├── Routes.php      # API route definitions
│   │       ├── Cors.php        # CORS configuration
│   │       └── Database.php    # Database credentials
│   ├── public/                 # Entry point (index.php)
│   ├── .env                    # Environment config
│   └── composer.json           # PHP dependencies
│
└── kbbks-fms-frontend/         # React Vite Frontend
    ├── src/
    │   ├── pages/              # Login, Dashboard, Vendor, Expense, Payment
    │   ├── components/         # FormInput, SubmitButton, Header, Sidebar
    │   ├── services/           # API calls (auth, vendor, expense, etc.)
    │   ├── contexts/           # AuthContext for global auth state
    │   └── App.jsx             # Main application layout
    ├── .env                    # Frontend environment config
    ├── vite.config.js          # Vite configuration
    └── package.json            # Node dependencies
```

---

## 🔧 Environment Configuration

### Backend (.env)
Located at: `kbbks-fms-backend/.env`
```dotenv
CI_ENVIRONMENT = development

# Database Configuration (default)
database.default.hostname = localhost
database.default.database = fms_db
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
database.default.port = 3306
```

**Change these if your MySQL setup is different** (e.g., password, port, hostname)

### Frontend (.env)
Located at: `kbbks-fms-frontend/.env`
```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

**Change this if:**
- Backend runs on different port
- Backend runs on different hostname (e.g., 127.0.0.1)
- Deploying to production

---

## 🌐 API Routes Overview

All endpoints require `Authorization: Bearer {token}` header

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login and get token
```

### Vendors
```
GET    /api/vendors           - List all vendors
POST   /api/vendors           - Create vendor
GET    /api/vendors/:id       - Get vendor details
PUT    /api/vendors/:id       - Update vendor
DELETE /api/vendors/:id       - Delete vendor
```

### Expenses
```
GET    /api/expenses          - List expenses
POST   /api/expenses          - Create expense (auto-creates bill)
GET    /api/expenses/:id      - Get expense
PUT    /api/expenses/:id      - Update expense
DELETE /api/expenses/:id      - Delete expense
```

### Payments
```
GET    /api/payments          - List payments
POST   /api/payments          - Record payment
GET    /api/payments/:id      - Get payment
PUT    /api/payments/:id      - Update payment
DELETE /api/payments/:id      - Delete payment
```

### Reports
```
GET    /api/reports/income-expense      - Total income, expense, outstanding
GET    /api/reports/vendor-outstanding  - Vendor-wise outstanding amounts
GET    /api/reports/monthly-expense     - Monthly expense breakdown
```

---

## 🔑 User Roles Explained

| Role | Dashboard | Vendor | Expense | Payment | Reports |
|------|-----------|--------|---------|---------|---------|
| **Admin** | ✅ View | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ View |
| **Accountant** | ✅ View | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ View |
| **Viewer** | ✅ View | ❌ | ❌ | ❌ | ✅ View |

---

## ⚙️ Running Both Servers

### Terminal 1 - Backend
```bash
cd kbbks-fms-backend
php spark serve --port=8080
```

### Terminal 2 - Frontend
```bash
cd kbbks-fms-frontend
npm run dev
```

**Both servers must be running simultaneously** for the app to work.

---

## 🧪 Testing the Application

### 1. Manual Testing Workflow
1. Login with `admin@test.com` / `password123`
2. Create a vendor: "ABC Supplies"
3. Record an expense: $500 for stationery
   - Bill "EXP-1" auto-created
4. Record a payment: $500 against Bill EXP-1
5. Check Dashboard → Click Refresh → See updated stats

### 2. API Testing (Using PowerShell)

#### Test Login
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@test.com","password":"password123"}'
$token = $response.token
echo "Token: $token"
```

#### Test Get Vendors
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/vendors" -Method GET -Headers @{"Authorization"="Bearer $token"}
```

---

## 🐛 Troubleshooting

### "MySQL connection refused" Error
**Solution:**
```bash
# Start MySQL service
Start-Service MySQL80

# Verify it's running
Get-Service MySQL80
```

### "Port 8080 already in use" Error
```bash
# Run on different port
php spark serve --port=8081
# Update frontend .env to http://localhost:8081/api
```

### "CORS error" on Frontend
**Cause:** Backend not running or ports misconfigured  
**Solution:**
1. Ensure `php spark serve` is running
2. Check `.env` has correct `VITE_API_BASE_URL`
3. Check `app/Config/Cors.php` includes your frontend port

### "No vendors in dropdown" in Expense Entry
**Cause:** Vendors not created yet  
**Solution:** Go to Vendor Master and create at least one vendor

### "Payment returns 500 error"
**Cause:** Usually a validation issue  
**Solution:** Check browser console and backend logs in `writable/logs/`

---

## 📦 Database Schema

### Users Table
- Stores login credentials, roles, tokens
- Encryption: `password_hash()` for security

### Vendors Table
- Vendor information: name, contact, phone, email

### Bills Table
- References vendors
- Auto-generated from expenses ("EXP-{id}")
- Tracks bill amount and date

### Expenses Table
- Records expense entries
- Links to vendor
- Amount, category, date, description

### Payments Table
- Records vendor payments
- References bills
- Amount, date, payment mode

### Ledgers Table (Double-Entry Bookkeeping)
- Tracks all financial transactions
- Debits and credits for expenses/payments
- References vendor and transaction type

### Invoices Table
- Optional: For future invoice generation

---

## 🔐 Security Features Implemented

✅ **Password Hashing** - Using PHP `password_hash()` with bcrypt  
✅ **Token Authentication** - 64-character random tokens  
✅ **Role-based Authorization** - Each endpoint checks user role  
✅ **Input Validation** - Frontend + Backend validation  
✅ **SQL Injection Prevention** - Using parameterized queries  
✅ **CORS Protection** - Whitelist allowed origins  
✅ **Transaction Safety** - Database transactions for multi-step operations

---

## 📝 Deployment Notes

For production deployment:

1. **Update backend `.env`:**
   - Set `CI_ENVIRONMENT = production`
   - Change `database.default.password` to secure password
   - Update database hostname if on different server

2. **Update frontend `.env`:**
   - Change `VITE_API_BASE_URL` to production backend URL
   - Example: `https://api.yourdomain.com/api`

3. **Build frontend:**
   ```bash
   npm run build
   # Outputs optimized files to dist/ folder
   ```

4. **Enable HTTPS** - Both backend and frontend should use HTTPS

5. **Check CORS** in `app/Config/Cors.php` - Update allowed origins

---

## 📞 Support & Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Vendors dropdown empty | Create at least one vendor in Vendor Master |
| Dashboard shows 0 values | Click "Refresh" button after creating expenses |
| 401 Unauthorized on API call | Token expired or invalid, login again |
| Database connection error | Check MySQL running, verify .env credentials |
| CORS error on frontend | Check backend running on 8080, verify .env port |

### Check Logs
Backend logs are saved to: `kbbks-fms-backend/writable/logs/`

---

## 🎓 Code Examples

### Creating a Vendor Programmatically (Backend API)
```bash
curl -X POST http://localhost:8080/api/vendors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"vendor_name":"ABC Corp","phone":"9876543210","email":"abc@test.com"}'
```

### Recording an Expense (Frontend React)
```javascript
import { addExpense } from '../services/expense.service';

await addExpense({
  expense_date: '2026-02-16',
  vendor_id: 1,
  description: 'Office stationery',
  amount: 500.00,
  category: 'Supplies'
});
```

---

## 📄 License

This project is provided as-is for KBBKS NGO. For internal use only.

---

## ✨ Future Enhancements

- [ ] PDF invoice generation
- [ ] Email notifications
- [ ] Multi-user collaboration
- [ ] Budget tracking
- [ ] Advanced reporting (charts, graphs)
- [ ] Bulk import/export
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Audit logs
- [ ] Data backup/restore

---

**Happy Financial Managing! 💰**
