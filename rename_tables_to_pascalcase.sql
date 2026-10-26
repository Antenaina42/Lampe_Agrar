-- Lampe Agrar: Migration script to rename lowercase tables to PascalCase for Hostinger / Linux MySQL
-- Run this directly in phpMyAdmin > SQL tab if you already imported database.sql earlier.

SET FOREIGN_KEY_CHECKS = 0;

RENAME TABLE `agriculturalmachine` TO `AgriculturalMachine`;
RENAME TABLE `attachment` TO `Attachment`;
RENAME TABLE `auditlog` TO `AuditLog`;
RENAME TABLE `bankimport` TO `BankImport`;
RENAME TABLE `banktransactionmatch` TO `BankTransactionMatch`;
RENAME TABLE `budget` TO `Budget`;
RENAME TABLE `budgetline` TO `BudgetLine`;
RENAME TABLE `crop` TO `Crop`;
RENAME TABLE `cropexpense` TO `CropExpense`;
RENAME TABLE `cropharvest` TO `CropHarvest`;
RENAME TABLE `cropsale` TO `CropSale`;
RENAME TABLE `cropseason` TO `CropSeason`;
RENAME TABLE `customer` TO `Customer`;
RENAME TABLE `employee` TO `Employee`;
RENAME TABLE `employeecost` TO `EmployeeCost`;
RENAME TABLE `farmsettings` TO `FarmSettings`;
RENAME TABLE `field` TO `Field`;
RENAME TABLE `financialaccount` TO `FinancialAccount`;
RENAME TABLE `inventoryitem` TO `InventoryItem`;
RENAME TABLE `inventorymovement` TO `InventoryMovement`;
RENAME TABLE `investment` TO `Investment`;
RENAME TABLE `invoice` TO `Invoice`;
RENAME TABLE `invoiceline` TO `InvoiceLine`;
RENAME TABLE `livestockexpense` TO `LivestockExpense`;
RENAME TABLE `livestockmovement` TO `LivestockMovement`;
RENAME TABLE `livestocksale` TO `LivestockSale`;
RENAME TABLE `loan` TO `Loan`;
RENAME TABLE `loanpayment` TO `LoanPayment`;
RENAME TABLE `machineexpense` TO `MachineExpense`;
RENAME TABLE `machineusage` TO `MachineUsage`;
RENAME TABLE `notification` TO `Notification`;
RENAME TABLE `payment` TO `Payment`;
RENAME TABLE `pigbatch` TO `PigBatch`;
RENAME TABLE `role` TO `Role`;
RENAME TABLE `storagelot` TO `StorageLot`;
RENAME TABLE `storagemovement` TO `StorageMovement`;
RENAME TABLE `supplier` TO `Supplier`;
RENAME TABLE `taxrate` TO `TaxRate`;
RENAME TABLE `transaction` TO `Transaction`;
RENAME TABLE `transactioncategory` TO `TransactionCategory`;
RENAME TABLE `user` TO `User`;
RENAME TABLE `userpreference` TO `UserPreference`;

SET FOREIGN_KEY_CHECKS = 1;
