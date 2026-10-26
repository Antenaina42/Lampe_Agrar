import fs from 'fs';

const mapping = {
  agriculturalmachine: 'AgriculturalMachine',
  attachment: 'Attachment',
  auditlog: 'AuditLog',
  bankimport: 'BankImport',
  banktransactionmatch: 'BankTransactionMatch',
  budget: 'Budget',
  budgetline: 'BudgetLine',
  crop: 'Crop',
  cropexpense: 'CropExpense',
  cropharvest: 'CropHarvest',
  cropsale: 'CropSale',
  cropseason: 'CropSeason',
  customer: 'Customer',
  employee: 'Employee',
  employeecost: 'EmployeeCost',
  farmsettings: 'FarmSettings',
  field: 'Field',
  financialaccount: 'FinancialAccount',
  inventoryitem: 'InventoryItem',
  inventorymovement: 'InventoryMovement',
  investment: 'Investment',
  invoice: 'Invoice',
  invoiceline: 'InvoiceLine',
  livestockexpense: 'LivestockExpense',
  livestockmovement: 'LivestockMovement',
  livestocksale: 'LivestockSale',
  loan: 'Loan',
  loanpayment: 'LoanPayment',
  machineexpense: 'MachineExpense',
  machineusage: 'MachineUsage',
  notification: 'Notification',
  payment: 'Payment',
  pigbatch: 'PigBatch',
  role: 'Role',
  storagelot: 'StorageLot',
  storagemovement: 'StorageMovement',
  supplier: 'Supplier',
  taxrate: 'TaxRate',
  transaction: 'Transaction',
  transactioncategory: 'TransactionCategory',
  user: 'User',
  userpreference: 'UserPreference',
};

let sql = fs.readFileSync('database.sql', 'utf8');

// Sort by length descending so longer words are matched first
const sortedKeys = Object.keys(mapping).sort((a, b) => b.length - a.length);

for (const key of sortedKeys) {
  const pascal = mapping[key];

  // Replace DROP TABLE IF EXISTS `table`
  sql = sql.replaceAll(`DROP TABLE IF EXISTS \`${key}\`;`, `DROP TABLE IF EXISTS \`${pascal}\`, \`${key}\`;`);

  // Replace CREATE TABLE `table`
  sql = sql.replaceAll(`CREATE TABLE \`${key}\``, `CREATE TABLE \`${pascal}\``);

  // Replace REFERENCES `table`
  sql = sql.replaceAll(`REFERENCES \`${key}\``, `REFERENCES \`${pascal}\``);

  // Replace INSERT INTO `table`
  sql = sql.replaceAll(`INSERT INTO \`${key}\``, `INSERT INTO \`${pascal}\``);

  // Replace ALTER TABLE `table`
  sql = sql.replaceAll(`ALTER TABLE \`${key}\``, `ALTER TABLE \`${pascal}\``);

  // Replace LOCK TABLES `table`
  sql = sql.replaceAll(`LOCK TABLES \`${key}\``, `LOCK TABLES \`${pascal}\``);

  // Replace comments `-- Table structure for table `table``
  sql = sql.replaceAll(`-- Table structure for table \`${key}\``, `-- Table structure for table \`${pascal}\``);

  // Replace comments `-- Dumping data for table `table``
  sql = sql.replaceAll(`-- Dumping data for table \`${key}\``, `-- Dumping data for table \`${pascal}\``);
}

fs.writeFileSync('database.sql', sql, 'utf8');
console.log('Successfully updated database.sql to PascalCase matching Prisma models!');

// Also generate rename_tables_to_pascalcase.sql
let renameSql = `-- Lampe Agrar: Migration script to rename lowercase tables to PascalCase for Hostinger / Linux MySQL
-- Run this directly in phpMyAdmin > SQL tab if you already imported database.sql earlier.

SET FOREIGN_KEY_CHECKS = 0;

`;

for (const key of Object.keys(mapping)) {
  const pascal = mapping[key];
  renameSql += `RENAME TABLE \`${key}\` TO \`${pascal}\`;\n`;
}

renameSql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;
fs.writeFileSync('rename_tables_to_pascalcase.sql', renameSql, 'utf8');
console.log('Successfully created rename_tables_to_pascalcase.sql!');
