-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 21, 2026 at 06:11 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kbbks_fms`
--

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `bill_number` varchar(50) DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `bill_amount` decimal(10,2) NOT NULL,
  `bill_file` varchar(255) DEFAULT NULL,
  `status` enum('Unpaid','Partially Paid','Paid') DEFAULT 'Unpaid',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`bill_id`, `vendor_id`, `bill_number`, `bill_date`, `bill_amount`, `bill_file`, `status`, `created_at`) VALUES
(1, 12, 'BILL-001', '2026-02-03', 5000.00, NULL, 'Unpaid', '2026-02-02 12:01:46'),
(2, 12, 'BILL-00', '2026-02-03', 5000.00, NULL, 'Unpaid', '2026-02-02 12:12:06'),
(3, 12, 'BILL-00', '0000-00-00', 5000.00, NULL, 'Unpaid', '2026-02-02 12:12:13'),
(4, 12, 'BILL-001', '2026-02-03', 5000.00, NULL, 'Unpaid', '2026-02-03 11:25:58'),
(5, 12, 'INV-001', '2023-04-01', 5000.00, NULL, 'Unpaid', '2026-02-07 00:22:02'),
(6, 17, 'BILL-001', '2023-04-01', 1000.00, NULL, 'Unpaid', '2026-02-07 03:14:25'),
(7, 11, 'BILL-010', '2023-04-04', 10070.00, NULL, 'Unpaid', '2026-02-07 03:16:47'),
(8, 19, 'BILL-070', '2023-06-04', 1007.00, NULL, 'Unpaid', '2026-02-07 03:17:53'),
(9, 19, 'BILL-011', '2023-10-04', 1099.00, NULL, 'Unpaid', '2026-02-07 03:20:31'),
(10, 19, 'BILL-111', '2024-10-04', 10990.00, NULL, 'Unpaid', '2026-02-07 05:39:23'),
(11, 11, 'BILL-0010', '2023-04-04', 10070.00, NULL, 'Unpaid', '2026-02-07 05:41:30'),
(12, 11, 'BILL-0010', '2023-04-04', 10070.00, NULL, 'Unpaid', '2026-02-08 07:14:57');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) UNSIGNED NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `expense_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `bill_file` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `vendor_id`, `amount`, `category`, `expense_date`, `description`, `bill_file`, `created_at`) VALUES
(1, 11, 5000.00, 'Office', '2026-01-29', 'Stationery purchase', NULL, '2026-02-02 13:45:47'),
(2, 11, 5000.00, ' ', '2026-01-29', '', NULL, '2026-02-02 13:57:05'),
(3, 11, 5000.00, ' ', '2026-01-29', '', NULL, '2026-02-02 13:59:00'),
(4, 21, 30000.00, 'classes', '2025-05-28', 'Annual classes for kids', NULL, '2026-02-07 09:06:19'),
(5, 21, 100.00, 'Travel', '2023-04-01', 'Travel expenses for April 2023', NULL, '2026-02-07 09:20:56'),
(6, 21, 100.00, 'Travel', '2023-04-01', 'Travel expenses for April 2023', NULL, '2026-02-08 12:45:09');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` int(11) NOT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `received_status` enum('Pending','Received') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ledger`
--

CREATE TABLE `ledger` (
  `ledger_id` int(11) NOT NULL,
  `reference_type` enum('Bill','Payment','Invoice','Expense') DEFAULT NULL,
  `reference_id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `debit` decimal(10,2) DEFAULT 0.00,
  `credit` decimal(10,2) DEFAULT 0.00,
  `entry_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ledger`
--

INSERT INTO `ledger` (`ledger_id`, `reference_type`, `reference_id`, `vendor_id`, `debit`, `credit`, `entry_date`, `created_at`) VALUES
(1, 'Expense', 1, 11, 5000.00, 0.00, '2026-01-29', '2026-02-02 13:45:47'),
(2, 'Expense', 2, 11, 5000.00, 0.00, '2026-01-29', '2026-02-02 13:57:05'),
(3, 'Expense', 3, 11, 5000.00, 0.00, '2026-01-29', '2026-02-02 13:59:00'),
(5, 'Payment', 1, NULL, 0.00, 2000.00, '2026-02-03', '2026-02-02 17:33:43'),
(7, 'Payment', 3, NULL, 0.00, 2000.00, '2026-02-03', '2026-02-03 16:57:57'),
(8, 'Payment', 4, NULL, 0.00, 2000.00, '2023-04-01', '2026-02-07 08:01:09'),
(9, 'Payment', 5, NULL, 0.00, 5000.00, '2023-04-03', '2026-02-07 08:03:58'),
(10, 'Expense', 4, 21, 30000.00, 0.00, '2025-05-28', '2026-02-07 09:06:19'),
(11, 'Expense', 5, 21, 100.00, 0.00, '2023-04-01', '2026-02-07 09:20:56'),
(12, 'Payment', 6, NULL, 0.00, 2000.00, '2023-04-01', '2026-02-08 12:44:12'),
(13, 'Expense', 6, 21, 100.00, 0.00, '2023-04-01', '2026-02-08 12:45:09');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `version` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `namespace` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `batch` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES
(1, '2026-02-02-133807', 'App\\Database\\Migrations\\CreateExpensesTable', 'default', 'App', 1770039718, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_mode` enum('Cash','Cheque','NEFT') NOT NULL,
  `instrument_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `bill_id`, `payment_date`, `amount_paid`, `payment_mode`, `instrument_file`, `created_at`) VALUES
(1, 1, '2026-02-03', 2000.00, 'Cash', NULL, '2026-02-02 12:03:43'),
(3, 1, '2026-02-03', 2000.00, 'Cash', NULL, '2026-02-03 11:27:57'),
(4, 1, '2023-04-01', 2000.00, 'Cash', NULL, '2026-02-07 02:31:09'),
(5, 1, '2023-04-03', 5000.00, '', NULL, '2026-02-07 02:33:58'),
(6, 1, '2023-04-01', 2000.00, 'Cash', NULL, '2026-02-08 07:14:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Accountant','Viewer') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `role`, `created_at`, `token`) VALUES
(1, 'Admin User', 'admin@gmail.com', '$2y$10$abcdefghijklmnopqrstuv', 'Admin', '2026-01-25 10:20:07', NULL),
(2, 'John Doe', 'john@gmail.com', '$2y$10$KlmKEKCqIb8hYPdTelSvp.677XAvP5ELAJOA1vaKUh7qSW5tx5fPm', 'Accountant', '2026-01-25 12:21:43', NULL),
(3, 'Renuka', 'renuka@gmail.com', '$2y$10$l7SK/wtGVUo3it6kt8ajv.0OmCX.z8xSh7Oh.iokLEbHbyJKpo8Vu', '', '2026-01-25 14:09:47', NULL),
(4, 'Aastha', 'aastha@gmail.com', '$2y$10$8L2x.XE5GPwhAoLV4ywujuJGeK455ecVDsQ9t59Unu74x8JfjCbM6', 'Accountant', '2026-01-25 14:39:20', NULL),
(5, 'Balaji', 'balaji@gmail.com', '$2y$10$0mS8wVzAFUNOocBmoddk.ONZibPNVZzbDKgTY3FIErIrSdpBA8HFS', 'Admin', '2026-01-25 15:43:58', NULL),
(6, 'Admin1', 'admin1@gmail.com', '$2y$10$zsnbF7FFpPvynO.nxZKpOeFOGcl99usw6YBXnH9yO1pYeF.Qvorjy', 'Admin', '2026-01-28 18:12:35', '5091cacf9bd0e23091b71585917d5cd8a4366a57f41cb6a0db105f2726629d10'),
(7, 'Ranjana', 'ranjana@gmail.com', '$2y$10$iZjSsT05qZLQ7dclRX7DquuDFZ7ifBspMn2lzQWNjVwPG5gaP4S3e', 'Admin', '2026-02-03 13:22:16', '66d90f39c018e82511ef340e199160da270d7b6e1c14f8fa5b9c468009b0f0e3'),
(8, 'Deep', 'deep@gmail.com', '$2y$10$mmbPDleqtJc0ivTrX63uDurCCQU4dqSBbhrh03qu0Wo5xkqTcZpkC', 'Viewer', '2026-02-04 15:51:23', NULL),
(9, 'Devi', 'devi@gmail.com', '$2y$10$AWVaeXgso4.RO9DSubm3demwC3j00vNVLY9quJ6YFff4f6pLD6TM6', 'Accountant', '2026-02-04 15:53:01', 'b2a679a61c3cd721f8f21fa47bb111abb635cf55e4ddcf809b0d500ba0cc81fd'),
(10, 'Kreeti', 'kreeti@gmail.com', '$2y$10$UyzzC1NQ4Le5yTHSzUawFOblALYCBX3v0zHYWbLnnS7.Y9rQWkL7e', 'Viewer', '2026-02-07 05:31:43', '2f3bf986ebf56073761446223d3064dee781f749a21cd4a87bff3db477e6e4dd'),
(11, 'Shradha', 'shradha@gmail.com', '$2y$10$sgYY2CFXWSwFdJCsr7JoZOfmQDQGCJwHhmgCkt1sBhQ47r.UDLsWK', 'Accountant', '2026-02-07 07:53:32', 'fb2eb508cd73ce90728bccaf1795a420708744b1ff8abbf0d1990142e490f1df');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `vendor_id` int(11) NOT NULL,
  `vendor_name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`vendor_id`, `vendor_name`, `contact_person`, `phone`, `email`, `logo`, `created_at`) VALUES
(3, 'ABC book stores', 'John Doe', '5555555555', 'johndoe@abcbookstores.com', NULL, '2026-01-20 15:45:34'),
(4, 'ABC enterprise', 'John', '9876543210', 'john@gmail.com', NULL, '2026-01-23 15:32:05'),
(7, 'ABC Traders', 'Ramesh', '9999999999', 'abc@gmail.com', NULL, '2026-01-28 19:51:27'),
(8, 'ABC Traders', 'Ramesh', '9999999988', NULL, NULL, '2026-01-28 19:54:34'),
(9, 'ABC Traders', 'Ramesh', '9999999988', NULL, NULL, '2026-01-28 19:54:58'),
(10, 'ABC Traders', 'Ramesh', '9999999988', NULL, NULL, '2026-01-28 19:55:06'),
(11, 'ABC Traders', 'Ramesh', '9999999999', 'abc@gmail.com', NULL, '2026-01-29 13:33:02'),
(12, 'ABC Traders', 'Ramesh', '9999999999', 'abc@gmail.com', NULL, '2026-01-29 13:35:00'),
(13, 'ABC Traders', 'Ramesh', '9999999999', 'abc@gmail.com', NULL, '2026-01-29 13:35:06'),
(14, 'uydgh', 'Ramesh', '9999999999', 'abc@gmailcom', NULL, '2026-01-29 13:35:38'),
(15, 'uydgh', 'Ramesh', '9999999999', '', NULL, '2026-01-29 13:35:44'),
(17, 'ABCDE Traders', 'Ramesh', '9999999988', 'abc@gmail.com', NULL, '2026-02-02 14:04:10'),
(19, 'Ranjana enterprise', 'Ranjana', '5555558888', 'abc@abcbookstores.com', NULL, '2026-02-04 16:05:05'),
(20, 'ieufgkjew', 'ugkajbf', '9999999999', 'ieufgkjew@ieufgkjew.com', NULL, '2026-02-07 05:25:21'),
(21, 'Aastha classes', 'Balaji', '9876543210', 'balaji@gmail.com', NULL, '2026-02-07 08:56:23'),
(22, 'Podar entriprises', 'Ranjana', '9876543211', 'ranjana@gmail.com', NULL, '2026-02-07 09:11:26'),
(23, 'Podar entriprises', 'Ranjana', '9876543211', 'ranjana@gmail.com', NULL, '2026-02-08 12:45:24'),
(24, 'Aastha pvt ltd', 'Balaji', '9876543211', 'aastha@gmail.com', NULL, '2026-02-21 14:49:47'),
(25, 'Aastha pvt ltd', 'Balaji', '9876543211', 'aastha@gmail.com', NULL, '2026-02-21 15:14:03'),
(26, 'Aastha pvt ltd', 'Balaji', '9876543211', 'aastha@gmail.com', 'public/uploads/vendor_logos/1771688061_94a8fa95813551b8e95b.png', '2026-02-21 15:34:21'),
(27, 'aastha enterprise', 'Balaji', '9767688111', 'ram@gmail.com', 'uploads/vendor_logos/1771692449_cb82c64ecebc4b499fc5.png', '2026-02-21 16:47:29'),
(28, 'Aastha pvt ltd', 'Balaji', '9876543211', 'aastha@gmail.com', NULL, '2026-02-21 16:59:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`);

--
-- Indexes for table `ledger`
--
ALTER TABLE `ledger`
  ADD PRIMARY KEY (`ledger_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `bill_id` (`bill_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`vendor_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ledger`
--
ALTER TABLE `ledger`
  MODIFY `ledger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `vendor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON UPDATE CASCADE;

--
-- Constraints for table `ledger`
--
ALTER TABLE `ledger`
  ADD CONSTRAINT `ledger_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
