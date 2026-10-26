-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: lampe_agrar_db
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agriculturalmachine`
--

DROP TABLE IF EXISTS `agriculturalmachine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agriculturalmachine` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `machineCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('TRACTOR','HARVESTER','SPRAYER','SPREADER','TRAILER','TRUCK','TILLAGE','SLURRY_TANKER','FORKLIFT','STORAGE_EQUIPMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hp` int DEFAULT NULL,
  `yearOfManufacture` int DEFAULT NULL,
  `purchaseDate` datetime(3) DEFAULT NULL,
  `purchasePrice` decimal(12,2) NOT NULL DEFAULT '0.00',
  `residualValue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `depreciationYears` int NOT NULL DEFAULT '8',
  `currentHoursOrKm` decimal(10,1) NOT NULL DEFAULT '0.0',
  `fuelConsumptionPerUnit` decimal(6,2) DEFAULT NULL,
  `insuranceAnnual` decimal(10,2) NOT NULL DEFAULT '0.00',
  `maintenanceAnnual` decimal(10,2) NOT NULL DEFAULT '0.00',
  `lastMaintenanceDate` datetime(3) DEFAULT NULL,
  `nextMaintenanceDueHours` decimal(10,1) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AgriculturalMachine_machineCode_key` (`machineCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agriculturalmachine`
--

/*!40000 ALTER TABLE `agriculturalmachine` DISABLE KEYS */;
INSERT INTO `agriculturalmachine` VALUES ('cmv9sqmza002t7x7c1tx1luxg','TRK-FENDT-724','Fendt 724 Vario ProfiPlus','TRACTOR','Fendt','724 Vario Gen6',246,2022,'2022-03-15 00:00:00.000',215000.00,120000.00,8,2840.0,14.50,2450.00,5800.00,NULL,3000.0,1,'2026-10-15 17:12:10.198','2026-10-15 17:12:10.198'),('cmv9sqmzf002u7x7cdjbh5ahl','TRK-FENDT-828','Fendt 828 Vario ProfiPlus','TRACTOR','Fendt','828 Vario',287,2021,'2021-04-10 00:00:00.000',245000.00,135000.00,8,3450.0,18.20,2780.00,6900.00,NULL,3500.0,1,'2026-10-15 17:12:10.203','2026-10-15 17:12:10.203'),('cmv9sqmzj002v7x7cuvl2z29w','TRK-FENDT-720','Fendt 720 Vario','TRACTOR','Fendt','720 Vario',209,2020,'2020-05-20 00:00:00.000',185000.00,95000.00,8,4200.0,13.00,2100.00,5200.00,NULL,4500.0,1,'2026-10-15 17:12:10.208','2026-10-15 17:12:10.208'),('cmv9sqmzo002w7x7c8la57j38','TRK-FENDT-930','Fendt 930 Vario ProfiPlus','TRACTOR','Fendt','930 Vario Gen7',305,2023,'2023-02-18 00:00:00.000',280000.00,175000.00,8,1890.0,21.00,3100.00,6400.00,NULL,2000.0,1,'2026-10-15 17:12:10.213','2026-10-15 17:12:10.213'),('cmv9sqmzt002x7x7cvymk7mw1','HARV-GRIMME-SE260','Grimme Kartoffelroder SE 260','HARVESTER','Grimme','SE 260 zweireihig',0,2021,'2021-08-01 00:00:00.000',198000.00,95000.00,10,780.0,NULL,1890.00,7500.00,NULL,850.0,1,'2026-10-15 17:12:10.217','2026-10-15 17:12:10.217'),('cmv9sqmzy002y7x7cix3ebuvw','SPRAY-DAMMANN-10K','Dammann Anhängespritze 10.000 l','SPRAYER','Dammann','Profi-Class 10.000 l (39m Gestänge)',0,2022,'2022-04-12 00:00:00.000',145000.00,80000.00,10,650.0,NULL,1400.00,3200.00,NULL,700.0,1,'2026-10-15 17:12:10.222','2026-10-15 17:12:10.222'),('cmv9sqn02002z7x7c9uy0nu01','SLURRY-KOTTE-18M3','Kotte Garant Güllefass 18 m³','SLURRY_TANKER','Kotte Garant','TAV 18.000 l Schleppschlauch',0,2020,'2020-03-01 00:00:00.000',92000.00,48000.00,10,920.0,NULL,980.00,2800.00,NULL,1000.0,1,'2026-10-15 17:12:10.226','2026-10-15 17:12:10.226'),('cmv9sqn0600307x7c1u4od8ib','COMB-CLAAS-630','Claas Lexion 630 Mähdrescher','HARVESTER','Claas','Lexion 630 mit Vario 680',313,2019,'2019-06-25 00:00:00.000',275000.00,125000.00,10,1140.0,NULL,2950.00,8200.00,NULL,1200.0,1,'2026-10-15 17:12:10.230','2026-10-15 17:12:10.230'),('cmv9sqn0a00317x7c1og72tg4','TRUCK-MB-ACTROS','Mercedes-Benz Actros Bandwagen LKW','TRUCK','Mercedes-Benz','Actros 1845 mit Bandauflieger',449,2020,'2020-09-10 00:00:00.000',115000.00,55000.00,8,145000.0,NULL,3400.00,4800.00,NULL,160000.0,1,'2026-10-15 17:12:10.234','2026-10-15 17:12:10.234');
/*!40000 ALTER TABLE `agriculturalmachine` ENABLE KEYS */;

--
-- Table structure for table `attachment`
--

DROP TABLE IF EXISTS `attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int NOT NULL,
  `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachment`
--

/*!40000 ALTER TABLE `attachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachment` ENABLE KEYS */;

--
-- Table structure for table `auditlog`
--

DROP TABLE IF EXISTS `auditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` json DEFAULT NULL,
  `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `AuditLog_userId_fkey` (`userId`),
  CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlog`
--

/*!40000 ALTER TABLE `auditlog` DISABLE KEYS */;
INSERT INTO `auditlog` VALUES ('cmv5p8f9r000113t7myu4iv8s','cmv5nu7mg000710954fqzn498','LOGIN','USER','cmv5nu7mg000710954fqzn498','{\"email\": \"gesa.langenberg@lampe-agrar.de\"}',NULL,'2026-10-12 20:22:56.847'),('cmv5paw6u000913t76plvhnk9','cmv5nu7mg000710954fqzn498','LOGOUT','USER','cmv5nu7mg000710954fqzn498','null',NULL,'2026-10-12 20:24:52.086'),('cmv5pcgnq000b13t7cmnu8t3r',NULL,'CLEAR_DEMO_DATA','SYSTEM',NULL,'null',NULL,'2026-10-12 20:26:05.271'),('cmv5ph7l6000d13t716bmiqxo','cmv5nu7na000f10950lf4l6i6','LOGIN','USER','cmv5nu7na000f10950lf4l6i6','{\"email\": \"kenneth.makowka@lampe-agrar.de\"}',NULL,'2026-10-12 20:29:46.795'),('cmvovo4yx000111a4n0hezzg4','cmv5nu7mg000710954fqzn498','LOGIN','USER','cmv5nu7mg000710954fqzn498','{\"email\": \"gesa.langenberg@lampe-agrar.de\"}',NULL,'2026-10-26 06:30:45.020'),('cmvovogwl000311a4do6ff4s2','cmv5nu7mg000710954fqzn498','LOGOUT','USER','cmv5nu7mg000710954fqzn498','null',NULL,'2026-10-26 06:31:00.501');
/*!40000 ALTER TABLE `auditlog` ENABLE KEYS */;

--
-- Table structure for table `bankimport`
--

DROP TABLE IF EXISTS `bankimport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bankimport` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `importDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `totalRows` int NOT NULL,
  `matchedRows` int NOT NULL DEFAULT '0',
  `unmatchedRows` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `BankImport_accountId_fkey` (`accountId`),
  CONSTRAINT `BankImport_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `financialaccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bankimport`
--

/*!40000 ALTER TABLE `bankimport` DISABLE KEYS */;
/*!40000 ALTER TABLE `bankimport` ENABLE KEYS */;

--
-- Table structure for table `banktransactionmatch`
--

DROP TABLE IF EXISTS `banktransactionmatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banktransactionmatch` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `importId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('MATCHED','UNMATCHED','IGNORED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNMATCHED',
  `matchedTransactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matchedInvoiceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `BankTransactionMatch_importId_fkey` (`importId`),
  CONSTRAINT `BankTransactionMatch_importId_fkey` FOREIGN KEY (`importId`) REFERENCES `bankimport` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banktransactionmatch`
--

/*!40000 ALTER TABLE `banktransactionmatch` DISABLE KEYS */;
/*!40000 ALTER TABLE `banktransactionmatch` ENABLE KEYS */;

--
-- Table structure for table `budget`
--

DROP TABLE IF EXISTS `budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `scenario` enum('OPTIMISTIC','CENTRAL','CAUTIOUS') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CENTRAL',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isCurrent` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget`
--

/*!40000 ALTER TABLE `budget` DISABLE KEYS */;
INSERT INTO `budget` VALUES ('cmv9sqn67004e7x7cnldpjyhq',2026,'CENTRAL','Wirtschaftsplan Lampe Agrar 2026 (Zentral)','Budgetplanung für 440 ha Ackerbau und Schweinemast 3.400 Plätze',1,'2026-10-15 17:12:10.447','2026-10-15 17:12:10.447');
/*!40000 ALTER TABLE `budget` ENABLE KEYS */;

--
-- Table structure for table `budgetline`
--

DROP TABLE IF EXISTS `budgetline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budgetline` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `budgetId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity` enum('GENERAL','CROPS','LIVESTOCK','POTATO_STORAGE','MACHINERY','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL',
  `categoryKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plannedRevenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `plannedExpense` decimal(12,2) NOT NULL DEFAULT '0.00',
  `quarter` int DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `BudgetLine_budgetId_fkey` (`budgetId`),
  CONSTRAINT `BudgetLine_budgetId_fkey` FOREIGN KEY (`budgetId`) REFERENCES `budget` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgetline`
--

/*!40000 ALTER TABLE `budgetline` DISABLE KEYS */;
INSERT INTO `budgetline` VALUES ('cmv9sqn67004f7x7coy5w9nd6','cmv9sqn67004e7x7cnldpjyhq','POTATO_STORAGE','REV_POTATO_SALES',510000.00,0.00,NULL,'Erwarteter Erlös Industriekartoffeln'),('cmv9sqn67004g7x7cun03ap6z','cmv9sqn67004e7x7cnldpjyhq','LIVESTOCK','REV_PIG_SALES',680000.00,0.00,NULL,'Erlös Schweinemast'),('cmv9sqn67004h7x7c21r4wioc','cmv9sqn67004e7x7cnldpjyhq','CROPS','REV_GRAIN_SALES',155000.00,0.00,NULL,'Getreidevermarktung'),('cmv9sqn67004i7x7c2obtsqk3','cmv9sqn67004e7x7cnldpjyhq','LIVESTOCK','EXP_FEED',0.00,385000.00,NULL,'Futterbedarf Schweine'),('cmv9sqn67004j7x7c3whmowfn','cmv9sqn67004e7x7cnldpjyhq','CROPS','EXP_FERTILIZER',0.00,95000.00,NULL,'Mineraldünger Gesamtbedarf'),('cmv9sqn67004k7x7cemvkpfdm','cmv9sqn67004e7x7cnldpjyhq','MACHINERY','EXP_FUEL',0.00,48000.00,NULL,'Agrardiesel'),('cmv9sqn67004l7x7cepyalhoy','cmv9sqn67004e7x7cnldpjyhq','GENERAL','EXP_WAGES',0.00,275000.00,NULL,'Jahreslohnsumme');
/*!40000 ALTER TABLE `budgetline` ENABLE KEYS */;

--
-- Table structure for table `crop`
--

DROP TABLE IF EXISTS `crop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crop` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cropType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `standardMarketPricePerTon` decimal(10,2) NOT NULL DEFAULT '0.00',
  `expectedYieldTonPerHa` decimal(8,2) NOT NULL DEFAULT '0.00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Crop_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crop`
--

/*!40000 ALTER TABLE `crop` DISABLE KEYS */;
INSERT INTO `crop` VALUES ('cmv9sqmvt001y7x7clis14ml4','Industriekartoffeln','CRP_POTATO','Hackfrucht',115.00,48.00,1,'2026-10-15 17:12:10.073','2026-10-15 17:12:10.073'),('cmv9sqmvy001z7x7cuoxv1xp3','Winterweizen (A-Weizen)','CRP_WHEAT','Getreide',225.00,8.50,1,'2026-10-15 17:12:10.078','2026-10-15 17:12:10.078'),('cmv9sqmw200207x7c8y1e639n','Silomais & Ackerfutter','CRP_CORN','Futterbau',46.00,46.00,1,'2026-10-15 17:12:10.082','2026-10-15 17:12:10.082'),('cmv9sqmw600217x7c0n081qpp','Winterraps','CRP_RAPE','Ölsaaten',465.00,3.90,1,'2026-10-15 17:12:10.086','2026-10-15 17:12:10.086'),('cmv9sqmwa00227x7ccx5c1sh6','Zuckerrüben','CRP_BEET','Hackfrucht',48.50,78.00,1,'2026-10-15 17:12:10.090','2026-10-15 17:12:10.090');
/*!40000 ALTER TABLE `crop` ENABLE KEYS */;

--
-- Table structure for table `cropexpense`
--

DROP TABLE IF EXISTS `cropexpense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cropexpense` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seasonId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `amountNet` decimal(10,2) NOT NULL,
  `vatAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `amountGross` decimal(10,2) NOT NULL,
  `supplierId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `CropExpense_seasonId_fkey` (`seasonId`),
  KEY `CropExpense_supplierId_fkey` (`supplierId`),
  CONSTRAINT `CropExpense_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `cropseason` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CropExpense_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cropexpense`
--

/*!40000 ALTER TABLE `cropexpense` DISABLE KEYS */;
/*!40000 ALTER TABLE `cropexpense` ENABLE KEYS */;

--
-- Table structure for table `cropharvest`
--

DROP TABLE IF EXISTS `cropharvest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cropharvest` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seasonId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `harvestDate` datetime(3) NOT NULL,
  `quantityTons` decimal(10,2) NOT NULL,
  `qualityGrade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storedTons` decimal(10,2) NOT NULL DEFAULT '0.00',
  `soldTons` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `CropHarvest_seasonId_fkey` (`seasonId`),
  CONSTRAINT `CropHarvest_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `cropseason` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cropharvest`
--

/*!40000 ALTER TABLE `cropharvest` DISABLE KEYS */;
/*!40000 ALTER TABLE `cropharvest` ENABLE KEYS */;

--
-- Table structure for table `cropsale`
--

DROP TABLE IF EXISTS `cropsale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cropsale` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cropId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `harvestId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saleDate` datetime(3) NOT NULL,
  `quantityTons` decimal(10,2) NOT NULL,
  `pricePerTon` decimal(10,2) NOT NULL,
  `totalNet` decimal(12,2) NOT NULL,
  `totalGross` decimal(12,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `CropSale_cropId_fkey` (`cropId`),
  KEY `CropSale_harvestId_fkey` (`harvestId`),
  KEY `CropSale_customerId_fkey` (`customerId`),
  KEY `CropSale_invoiceId_fkey` (`invoiceId`),
  CONSTRAINT `CropSale_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `crop` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CropSale_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CropSale_harvestId_fkey` FOREIGN KEY (`harvestId`) REFERENCES `cropharvest` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CropSale_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cropsale`
--

/*!40000 ALTER TABLE `cropsale` DISABLE KEYS */;
/*!40000 ALTER TABLE `cropsale` ENABLE KEYS */;

--
-- Table structure for table `cropseason`
--

DROP TABLE IF EXISTS `cropseason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cropseason` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seasonYear` int NOT NULL,
  `cropId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fieldId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `areaHa` decimal(8,2) NOT NULL,
  `sowingDate` datetime(3) DEFAULT NULL,
  `harvestDate` datetime(3) DEFAULT NULL,
  `expectedYieldTons` decimal(10,2) NOT NULL DEFAULT '0.00',
  `actualYieldTons` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalDirectCost` decimal(12,2) NOT NULL DEFAULT '0.00',
  `totalRevenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `grossMargin` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('PLANNED','GROWING','HARVESTED','CLOSED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GROWING',
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CropSeason_cropId_fkey` (`cropId`),
  KEY `CropSeason_fieldId_fkey` (`fieldId`),
  CONSTRAINT `CropSeason_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `crop` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CropSeason_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cropseason`
--

/*!40000 ALTER TABLE `cropseason` DISABLE KEYS */;
INSERT INTO `cropseason` VALUES ('cmv9sqmxg002c7x7c9bl37wp9',2026,'cmv9sqmvt001y7x7clis14ml4','cmv9sqmwi00237x7c8motzb48',42.50,NULL,NULL,2040.00,2085.00,98500.00,242000.00,143500.00,'HARVESTED',NULL,'2026-10-15 17:12:10.133','2026-10-15 17:12:10.133'),('cmv9sqmxl002e7x7cscunnrre',2026,'cmv9sqmvt001y7x7clis14ml4','cmv9sqmx700297x7cygsvv8n1',48.00,NULL,NULL,2304.00,2380.00,111200.00,275800.00,164600.00,'HARVESTED',NULL,'2026-10-15 17:12:10.138','2026-10-15 17:12:10.138'),('cmv9sqmxq002g7x7c9e8yyo9p',2026,'cmv9sqmvy001z7x7cuoxv1xp3','cmv9sqmwz00277x7c1wvpmfki',72.50,NULL,NULL,616.25,624.00,65250.00,140400.00,75150.00,'HARVESTED',NULL,'2026-10-15 17:12:10.142','2026-10-15 17:12:10.142'),('cmv9sqmxu002i7x7cqi3sjg0y',2026,'cmv9sqmw200207x7c8y1e639n','cmv9sqmxb002a7x7cxtgq4khw',35.00,NULL,NULL,1610.00,1645.00,31500.00,75670.00,44170.00,'HARVESTED',NULL,'2026-10-15 17:12:10.147','2026-10-15 17:12:10.147'),('cmv9sqmxz002k7x7c3gxro95m',2026,'cmv9sqmw600217x7c0n081qpp','cmv9sqmwr00257x7ct6e7g98v',50.00,NULL,NULL,195.00,198.50,45000.00,92300.00,47300.00,'HARVESTED',NULL,'2026-10-15 17:12:10.151','2026-10-15 17:12:10.151'),('cmv9sqmy3002m7x7caf86i2ka',2026,'cmv9sqmwa00227x7ccx5c1sh6','cmv9sqmwn00247x7cnbjriy1f',30.00,NULL,NULL,2340.00,2390.00,39000.00,115900.00,76900.00,'HARVESTED',NULL,'2026-10-15 17:12:10.155','2026-10-15 17:12:10.155');
/*!40000 ALTER TABLE `cropseason` ENABLE KEYS */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contactName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postalCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vatNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentTermsDays` int NOT NULL DEFAULT '30',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Customer_customerNumber_key` (`customerNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('cmv9sqmue001o7x7cdl2udf0v','KND-1001','Emsland Stärke GmbH','Dr. Michael Schröder','kartoffel-einkauf@emsland-group.de','05943/810','Emslandstraße 58','49824','Emlichheim','DE117036294',14,'Hauptabnehmer Industriekartoffeln. Kontrakte für Kampagne 2026/2027.','2026-10-15 17:12:10.022','2026-10-15 17:12:10.022'),('cmv9sqmuj001p7x7cx1d2om4x','KND-1002','Vion Zucht- und Nutzvieh GmbH','Christian Wehrmann','vieheinkauf@vionfood.com','05432/890','Industriestraße 12','49624','Löningen','DE156829104',7,'Wöchentliche Abnahme von Mastschweinen (Haltungsform 4 & 2). Abrechnung nach AutoFOM.','2026-10-15 17:12:10.027','2026-10-15 17:12:10.027'),('cmv9sqmun001q7x7cwzq6b8a9','KND-1003','Nordzucker AG','Markus Kuhlmann','rueben-anbau@nordzucker.com','0531/24110','Küchenstraße 9','38100','Braunschweig','DE114878201',30,'Abnahme Zuckerrüben Werk Uelzen / Schladen.','2026-10-15 17:12:10.031','2026-10-15 17:12:10.031'),('cmv9sqmur001r7x7cjhs23qmo','KND-1004','Raiffeisen Warengenossenschaft eG Diepholz-Barnstorf','Stefan Brockmann','getreide@rwg-diepholz.de','05441/9870','Lüderstraße 14','49406','Barnstorf','DE117765432',14,'Abnahme Getreide (Weizen, Gerste, Triticale) und Winterraps.','2026-10-15 17:12:10.036','2026-10-15 17:12:10.036');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employmentType` enum('FULL_TIME','PART_TIME','SEASONAL','APPRENTICE','MANAGEMENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FULL_TIME',
  `monthlyGrossSalary` decimal(10,2) NOT NULL,
  `monthlyEmployerCost` decimal(10,2) NOT NULL,
  `allocatedActivity` enum('GENERAL','CROPS','LIVESTOCK','POTATO_STORAGE','MACHINERY','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL',
  `hireDate` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Employee_employeeNumber_key` (`employeeNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('cmv9sqn0i00327x7c4jx0cx04','EMP-001','Kenneth','Makowka','Ackerbauleiter (Pflanzenbau & Maschineneinsatz)','MANAGEMENT',4850.00,5880.00,'CROPS','2019-03-01 00:00:00.000',1,'2026-10-15 17:12:10.243','2026-10-15 17:12:10.243'),('cmv9sqn0n00337x7cjm996eeg','EMP-002','Torsten','Brinkmann','Vollzeit Mitarbeiter Schweinemast (Haltungsform 4 & 2)','FULL_TIME',3750.00,4560.00,'LIVESTOCK','2020-04-15 00:00:00.000',1,'2026-10-15 17:12:10.247','2026-10-15 17:12:10.247'),('cmv9sqn0r00347x7cycp5sxn4','EMP-003','Felix','Landwehr','Vollzeit Mitarbeiter Ackerbau & Bodenbearbeitung','FULL_TIME',3600.00,4380.00,'CROPS','2021-08-01 00:00:00.000',1,'2026-10-15 17:12:10.251','2026-10-15 17:12:10.251'),('cmv9sqn0v00357x7cpdcfgiic','EMP-004','Christian','Müller','Vollzeit Mitarbeiter Ackerbau & Fuhrpark','FULL_TIME',3450.00,4200.00,'CROPS','2022-02-01 00:00:00.000',1,'2026-10-15 17:12:10.256','2026-10-15 17:12:10.256'),('cmv9sqn0z00367x7csmm28iq3','EMP-005','Sabine','Westermann','Teilzeit Büro & Dokumentation','PART_TIME',1850.00,2260.00,'ADMIN','2021-01-10 00:00:00.000',1,'2026-10-15 17:12:10.260','2026-10-15 17:12:10.260'),('cmv9sqn1400377x7cd2r3k9fy','EMP-006','Jonas','Ehlers','Auszubildender Landwirt (2. Lehrjahr)','APPRENTICE',1100.00,1350.00,'GENERAL','2025-08-01 00:00:00.000',1,'2026-10-15 17:12:10.264','2026-10-15 17:12:10.264');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;

--
-- Table structure for table `employeecost`
--

DROP TABLE IF EXISTS `employeecost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeecost` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `baseSalary` decimal(10,2) NOT NULL,
  `employerSocialCharges` decimal(10,2) NOT NULL,
  `bonuses` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalCost` decimal(10,2) NOT NULL,
  `hoursWorked` decimal(6,1) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `EmployeeCost_employeeId_fkey` (`employeeId`),
  CONSTRAINT `EmployeeCost_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employeecost`
--

/*!40000 ALTER TABLE `employeecost` DISABLE KEYS */;
/*!40000 ALTER TABLE `employeecost` ENABLE KEYS */;

--
-- Table structure for table `farmsettings`
--

DROP TABLE IF EXISTS `farmsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `farmsettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `farmName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Lampe Agrar',
  `legalName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Lampe Agrar - Gesa & Dr. Josef Langenberg',
  `taxId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'DE123456789',
  `vatId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'DE987654321',
  `iban` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hünenheide 3',
  `postalCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '49406',
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Bockstedt / Drentwede',
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '04246/95026',
  `mobile` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0151/42343339',
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info@lampe-agrar.de',
  `website` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://www.hi-gesa.de',
  `logoUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fiscalYearStart` int NOT NULL DEFAULT '1',
  `fiscalYearEnd` int NOT NULL DEFAULT '12',
  `defaultVatRate` decimal(5,2) NOT NULL DEFAULT '19.00',
  `defaultLanguage` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'de',
  `isDemoMode` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farmsettings`
--

/*!40000 ALTER TABLE `farmsettings` DISABLE KEYS */;
INSERT INTO `farmsettings` VALUES ('cmv9sqmq3000u7x7cs2foxhmw','Lampe Agrar','Lampe Agrar - Gesa & Dr. Josef Langenberg GbR','38/204/11452','DE284920184','DE89 2806 9954 0001 2345 67','GENODEF1VEC','Volksbank Vechta eG','Hünenheide 3','49406','Bockstedt / Drentwede','04246/95026','0151/42343339','info@lampe-agrar.de','https://www.hi-gesa.de',NULL,1,12,19.00,'de',1,'2026-10-15 17:12:09.868','2026-10-15 17:12:09.868');
/*!40000 ALTER TABLE `farmsettings` ENABLE KEYS */;

--
-- Table structure for table `field`
--

DROP TABLE IF EXISTS `field`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `field` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fieldNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `areaHa` decimal(8,2) NOT NULL,
  `soilQualityScore` decimal(5,1) DEFAULT NULL,
  `locationDescription` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Field_fieldNumber_key` (`fieldNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `field`
--

/*!40000 ALTER TABLE `field` DISABLE KEYS */;
INSERT INTO `field` VALUES ('cmv9sqmwi00237x7c8motzb48','SCH-01','Hünenheide Nord',42.50,54.0,'Hofnahe Fläche direkt an Hünenheide 3',1,'2026-10-15 17:12:10.099','2026-10-15 17:12:10.099'),('cmv9sqmwn00247x7cnbjriy1f','SCH-02','Hünenheide Süd',38.00,52.5,'Südlich der Hofstelle Bockstedt',1,'2026-10-15 17:12:10.103','2026-10-15 17:12:10.103'),('cmv9sqmwr00257x7ct6e7g98v','SCH-03','Drentweder Mooracker',55.00,46.0,'Gemarkung Drentwede Richtung Barnstorf',1,'2026-10-15 17:12:10.108','2026-10-15 17:12:10.108'),('cmv9sqmwv00267x7cut5pzg57','SCH-04','Bockstedter Esch',65.00,61.0,'Bester Ackerboden, hoher Humusgehalt',1,'2026-10-15 17:12:10.112','2026-10-15 17:12:10.112'),('cmv9sqmwz00277x7c1wvpmfki','SCH-05','Barnstorfer Kamp',72.50,58.0,'Großflächiger Ackerschlag für Weizen/Raps',1,'2026-10-15 17:12:10.116','2026-10-15 17:12:10.116'),('cmv9sqmx300287x7cl33t44yw','SCH-06','Aldorfer Flur',84.00,55.5,'Schlagkomplex Richtung Twistringen',1,'2026-10-15 17:12:10.119','2026-10-15 17:12:10.119'),('cmv9sqmx700297x7cygsvv8n1','SCH-07','Ridder Esch',48.00,53.0,'Sandiger Lehm, optimal für Kartoffelanbau',1,'2026-10-15 17:12:10.123','2026-10-15 17:12:10.123'),('cmv9sqmxb002a7x7cxtgq4khw','SCH-08','Düster Esch',35.00,49.0,'Mais- und Futterbaufläche',1,'2026-10-15 17:12:10.127','2026-10-15 17:12:10.127');
/*!40000 ALTER TABLE `field` ENABLE KEYS */;

--
-- Table structure for table `financialaccount`
--

DROP TABLE IF EXISTS `financialaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financialaccount` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accountType` enum('CHECKING','SAVINGS','CASH','CREDIT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHECKING',
  `accountNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initialBalance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currentBalance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EUR',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financialaccount`
--

/*!40000 ALTER TABLE `financialaccount` DISABLE KEYS */;
INSERT INTO `financialaccount` VALUES ('cmv5nu7ok000v1095xbxjyajx','Volksbank Vechta - Geschäftskonto','CHECKING','123456700','DE89 2806 9954 0001 2345 67','GENODEF1VEC',245000.00,312450.80,'EUR',1,1,'2026-10-12 19:43:54.213','2026-10-15 17:12:09.876'),('cmv5nu7op000w109587imr8k0','Landwirtschaftliche Rentenbank - Investitionskonto','SAVINGS','987654321','DE45 5002 0000 0098 7654 32','LRBTDEF1',150000.00,118400.00,'EUR',0,1,'2026-10-12 19:43:54.217','2026-10-15 17:12:09.882'),('cmv5nu7ot000x1095e8wznbbk','Betriebskasse Hünenheide (Bar)','CASH','KASSE-01',NULL,NULL,3500.00,4210.50,'EUR',0,1,'2026-10-12 19:43:54.221','2026-10-15 17:12:09.889');
/*!40000 ALTER TABLE `financialaccount` ENABLE KEYS */;

--
-- Table structure for table `inventoryitem`
--

DROP TABLE IF EXISTS `inventoryitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventoryitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itemCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('SEEDS','FERTILIZER','PESTICIDES','ANIMAL_FEED','STRAW_BEDDING','SPARE_PARTS','FUEL','WORKSHOP_SUPPLIES') COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kg',
  `currentQuantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `minStockThreshold` decimal(10,2) NOT NULL DEFAULT '0.00',
  `averageUnitPrice` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalStockValue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `storageLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplierId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `InventoryItem_itemCode_key` (`itemCode`),
  KEY `InventoryItem_supplierId_fkey` (`supplierId`),
  CONSTRAINT `InventoryItem_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventoryitem`
--

/*!40000 ALTER TABLE `inventoryitem` DISABLE KEYS */;
INSERT INTO `inventoryitem` VALUES ('cmv9sqn1b00387x7crgg8iod7','INV-FUTTER-KORN','Mastschweinefutter Endmast (RWG Diepholz)','ANIMAL_FEED','t',42.00,15.00,310.00,13020.00,'Futtersilos Außenklimastall',NULL,'2026-10-15 17:12:10.272','2026-10-15 17:12:10.272'),('cmv9sqn1g00397x7cmglogy32','INV-DIESEL-AGRAR','Agrardiesel schwefelfrei','FUEL','l',11500.00,3000.00,1.38,15870.00,'Tankanlage Hofstelle 15.000 l',NULL,'2026-10-15 17:12:10.276','2026-10-15 17:12:10.276'),('cmv9sqn1k003a7x7c9ey9z488','INV-DUENGER-KAS','KAS 27% N Mineraldünger','FERTILIZER','t',28.00,10.00,360.00,10080.00,'Düngerschuppen Hünenheide',NULL,'2026-10-15 17:12:10.281','2026-10-15 17:12:10.281'),('cmv9sqn1o003b7x7cf8vw1z4v','INV-STROH-QUADER','Weizenstroh Quaderballen (Einstreu H4)','STRAW_BEDDING','Ballen',380.00,100.00,38.00,14440.00,'Strohlagerhalle West',NULL,'2026-10-15 17:12:10.285','2026-10-15 17:12:10.285');
/*!40000 ALTER TABLE `inventoryitem` ENABLE KEYS */;

--
-- Table structure for table `inventorymovement`
--

DROP TABLE IF EXISTS `inventorymovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventorymovement` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itemId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `movementType` enum('PURCHASE_RECEIPT','USAGE_CROPS','USAGE_PIGS','USAGE_MACHINES','ADJUSTMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalValue` decimal(12,2) NOT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `InventoryMovement_itemId_fkey` (`itemId`),
  CONSTRAINT `InventoryMovement_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `inventoryitem` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventorymovement`
--

/*!40000 ALTER TABLE `inventorymovement` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventorymovement` ENABLE KEYS */;

--
-- Table structure for table `investment`
--

DROP TABLE IF EXISTS `investment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('MACHINERY','BUILDING','LIVESTOCK_FACILITY','STORAGE','LAND_IMPROVEMENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `purchaseDate` datetime(3) NOT NULL,
  `supplierId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `downPayment` decimal(12,2) NOT NULL DEFAULT '0.00',
  `financingType` enum('BANK_LOAN','OWN_EQUITY','LEASING') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BANK_LOAN',
  `depreciationYears` int NOT NULL DEFAULT '10',
  `salvageValue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Investment_supplierId_fkey` (`supplierId`),
  CONSTRAINT `Investment_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investment`
--

/*!40000 ALTER TABLE `investment` DISABLE KEYS */;
INSERT INTO `investment` VALUES ('cmv9sqn4g004a7x7c8rw6tt34','Neubau Außenklimastall Haltungsform 4 (1.400 Plätze mit Kot-Harn-Trennung)','LIVESTOCK_FACILITY',680000.00,'2023-06-15 00:00:00.000',NULL,180000.00,'BANK_LOAN',20,50000.00,'Investition in zukunftsfähiges Tierwohl mit automatischer Stroheinstreu.','2026-10-15 17:12:10.384','2026-10-15 17:12:10.384'),('cmv9sqn4l004b7x7c79jpprjk','Fendt 930 Vario Schlepper mit RTK-Lenksystem','MACHINERY',280000.00,'2023-02-18 00:00:00.000',NULL,80000.00,'BANK_LOAN',8,120000.00,'Hauptschlepper für schwere Bodenbearbeitung und Aussaat.','2026-10-15 17:12:10.389','2026-10-15 17:12:10.389');
/*!40000 ALTER TABLE `investment` ENABLE KEYS */;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('OUTGOING','INCOMING') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OUTGOING',
  `customerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplierId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issueDate` datetime(3) NOT NULL,
  `dueDate` datetime(3) NOT NULL,
  `status` enum('DRAFT','SENT','PAID','PARTIALLY_PAID','OVERDUE','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `subtotal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `taxAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `totalAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `paidAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EUR',
  `language` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'de',
  `activity` enum('GENERAL','CROPS','LIVESTOCK','POTATO_STORAGE','MACHINERY','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `isDemo` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Invoice_invoiceNumber_key` (`invoiceNumber`),
  KEY `Invoice_customerId_fkey` (`customerId`),
  KEY `Invoice_supplierId_fkey` (`supplierId`),
  CONSTRAINT `Invoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Invoice_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES ('cmv9sqn25003d7x7c9vlrv6on','RE-2026-0089','OUTGOING','cmv9sqmue001o7x7cdl2udf0v',NULL,'2026-09-28 00:00:00.000','2026-10-12 00:00:00.000','PAID',84525.00,9044.18,93569.18,93569.18,'EUR','de','POTATO_STORAGE','Lieferung 735 Tonnen Industriekartoffeln Kampagne 2026',1,'2026-10-15 17:12:10.301','2026-10-15 17:12:10.301'),('cmv9sqn2k003j7x7cd68716kk','RE-2026-0090','OUTGOING','cmv9sqmuj001p7x7cx1d2om4x',NULL,'2026-10-04 00:00:00.000','2026-10-11 00:00:00.000','PARTIALLY_PAID',62450.00,6682.15,69132.15,40000.00,'EUR','de','LIVESTOCK','Schlachtschweine Durchgang H4 (350 Tiere)',1,'2026-10-15 17:12:10.316','2026-10-15 17:12:10.316'),('cmv9sqn2w003p7x7ca6fbk2xf','ER-2026-0412','INCOMING',NULL,'cmv9sqmv0001s7x7ccd53rrwv','2026-09-20 00:00:00.000','2026-10-20 00:00:00.000','PAID',24800.00,1736.00,26536.00,26536.00,'EUR','de','LIVESTOCK','Lieferung 80 t Schweinemastfutter Vormast/Endmast',1,'2026-10-15 17:12:10.329','2026-10-15 17:12:10.329'),('cmv9sqn3a003v7x7cfqe9m9qq','ER-2026-0415','INCOMING',NULL,'cmv9sqmvc001v7x7c69ag740m','2026-10-02 00:00:00.000','2026-10-16 00:00:00.000','DRAFT',13800.00,2622.00,16422.00,0.00,'EUR','de','MACHINERY','Betankung Hofstelle 10.000 l Agrardiesel',1,'2026-10-15 17:12:10.342','2026-10-15 17:12:10.342');
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;

--
-- Table structure for table `invoiceline`
--

DROP TABLE IF EXISTS `invoiceline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoiceline` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(10,3) NOT NULL DEFAULT '1.000',
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Stk',
  `unitPrice` decimal(12,2) NOT NULL DEFAULT '0.00',
  `taxRate` decimal(5,2) NOT NULL DEFAULT '19.00',
  `taxAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `subtotal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `InvoiceLine_invoiceId_fkey` (`invoiceId`),
  CONSTRAINT `InvoiceLine_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceline`
--

/*!40000 ALTER TABLE `invoiceline` DISABLE KEYS */;
INSERT INTO `invoiceline` VALUES ('cmv9sqn2a003f7x7cxfhqvgkw','cmv9sqn25003d7x7c9vlrv6on','Industriekartoffeln Sorte Innovator (735 t)',735.000,'t',115.00,10.70,9044.18,84525.00,93569.18),('cmv9sqn2o003l7x7cv2yiutwb','cmv9sqn2k003j7x7cd68716kk','Mastschweine Haltungsform 4 (350 Tiere, 33.750 kg SG)',33750.000,'kg',1.85,10.70,6682.15,62450.00,69132.15),('cmv9sqn31003r7x7c0h5m0xdo','cmv9sqn2w003p7x7ca6fbk2xf','Schweinemastfutter Premium (80 t)',80.000,'t',310.00,7.00,1736.00,24800.00,26536.00),('cmv9sqn3e003x7x7ch8p59w46','cmv9sqn3a003v7x7cfqe9m9qq','Agrardiesel 10.000 l',10000.000,'l',1.38,19.00,2622.00,13800.00,16422.00);
/*!40000 ALTER TABLE `invoiceline` ENABLE KEYS */;

--
-- Table structure for table `livestockexpense`
--

DROP TABLE IF EXISTS `livestockexpense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livestockexpense` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batchId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('FEED','VET','BEDDING_STRAW','ENERGY','BARN_UPKEEP','LABOR','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `amountNet` decimal(10,2) NOT NULL,
  `vatAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `amountGross` decimal(10,2) NOT NULL,
  `supplierId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `LivestockExpense_batchId_fkey` (`batchId`),
  KEY `LivestockExpense_supplierId_fkey` (`supplierId`),
  CONSTRAINT `LivestockExpense_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `pigbatch` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `LivestockExpense_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livestockexpense`
--

/*!40000 ALTER TABLE `livestockexpense` DISABLE KEYS */;
/*!40000 ALTER TABLE `livestockexpense` ENABLE KEYS */;

--
-- Table structure for table `livestockmovement`
--

DROP TABLE IF EXISTS `livestockmovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livestockmovement` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batchId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `movementType` enum('ARRIVAL','SALE','DEATH','TRANSFER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `pigCount` int NOT NULL,
  `avgWeightKg` decimal(6,2) DEFAULT NULL,
  `totalWeightKg` decimal(10,2) DEFAULT NULL,
  `pricePerKg` decimal(6,2) DEFAULT NULL,
  `totalAmount` decimal(12,2) DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `LivestockMovement_batchId_fkey` (`batchId`),
  CONSTRAINT `LivestockMovement_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `pigbatch` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livestockmovement`
--

/*!40000 ALTER TABLE `livestockmovement` DISABLE KEYS */;
/*!40000 ALTER TABLE `livestockmovement` ENABLE KEYS */;

--
-- Table structure for table `livestocksale`
--

DROP TABLE IF EXISTS `livestocksale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livestocksale` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batchId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saleDate` datetime(3) NOT NULL,
  `pigCount` int NOT NULL,
  `totalWeightKg` decimal(10,2) NOT NULL,
  `avgWeightKg` decimal(6,2) NOT NULL,
  `pricePerKg` decimal(6,2) NOT NULL,
  `bonusPenalty` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalNet` decimal(12,2) NOT NULL,
  `totalGross` decimal(12,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `LivestockSale_batchId_fkey` (`batchId`),
  KEY `LivestockSale_customerId_fkey` (`customerId`),
  KEY `LivestockSale_invoiceId_fkey` (`invoiceId`),
  CONSTRAINT `LivestockSale_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `pigbatch` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `LivestockSale_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `LivestockSale_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livestocksale`
--

/*!40000 ALTER TABLE `livestocksale` DISABLE KEYS */;
/*!40000 ALTER TABLE `livestocksale` ENABLE KEYS */;

--
-- Table structure for table `loan`
--

DROP TABLE IF EXISTS `loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loanNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lenderName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `principalAmount` decimal(12,2) NOT NULL,
  `interestRate` decimal(5,2) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `termMonths` int NOT NULL,
  `monthlyPayment` decimal(10,2) NOT NULL,
  `remainingPrincipal` decimal(12,2) NOT NULL,
  `status` enum('ACTIVE','PAID_OFF') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Loan_loanNumber_key` (`loanNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan`
--

/*!40000 ALTER TABLE `loan` DISABLE KEYS */;
INSERT INTO `loan` VALUES ('cmv9sqn54004c7x7czyw1d0f8','DARL-TIERWOHL-2023','Landwirtschaftliche Rentenbank (über Volksbank Vechta)',500000.00,2.85,'2023-07-01 00:00:00.000','2038-06-30 00:00:00.000',180,3418.00,418200.00,'ACTIVE','2026-10-15 17:12:10.408','2026-10-15 17:12:10.408'),('cmv9sqn58004d7x7c3asnq9h8','DARL-FENDT-2023','AGCO Finance / Fendt Finanzierung',200000.00,3.40,'2023-03-01 00:00:00.000','2029-02-28 00:00:00.000',72,3074.00,114800.00,'ACTIVE','2026-10-15 17:12:10.413','2026-10-15 17:12:10.413');
/*!40000 ALTER TABLE `loan` ENABLE KEYS */;

--
-- Table structure for table `loanpayment`
--

DROP TABLE IF EXISTS `loanpayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loanpayment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentDate` datetime(3) NOT NULL,
  `totalPayment` decimal(10,2) NOT NULL,
  `principalPortion` decimal(10,2) NOT NULL,
  `interestPortion` decimal(10,2) NOT NULL,
  `remainingBalance` decimal(12,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `LoanPayment_loanId_fkey` (`loanId`),
  CONSTRAINT `LoanPayment_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `loan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loanpayment`
--

/*!40000 ALTER TABLE `loanpayment` DISABLE KEYS */;
/*!40000 ALTER TABLE `loanpayment` ENABLE KEYS */;

--
-- Table structure for table `machineexpense`
--

DROP TABLE IF EXISTS `machineexpense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machineexpense` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `machineId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expenseType` enum('MAINTENANCE','REPAIR','FUEL','INSURANCE','INSPECTION_TUV','PARTS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amountNet` decimal(10,2) NOT NULL,
  `vatAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `amountGross` decimal(10,2) NOT NULL,
  `supplierId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operatingHours` decimal(10,1) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `MachineExpense_machineId_fkey` (`machineId`),
  KEY `MachineExpense_supplierId_fkey` (`supplierId`),
  CONSTRAINT `MachineExpense_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `agriculturalmachine` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `MachineExpense_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machineexpense`
--

/*!40000 ALTER TABLE `machineexpense` DISABLE KEYS */;
/*!40000 ALTER TABLE `machineexpense` ENABLE KEYS */;

--
-- Table structure for table `machineusage`
--

DROP TABLE IF EXISTS `machineusage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machineusage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `machineId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `hoursUsed` decimal(6,1) NOT NULL,
  `fieldId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activity` enum('GENERAL','CROPS','LIVESTOCK','POTATO_STORAGE','MACHINERY','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CROPS',
  `driverEmployeeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fuelLitersUsed` decimal(8,1) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `MachineUsage_machineId_fkey` (`machineId`),
  CONSTRAINT `MachineUsage_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `agriculturalmachine` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machineusage`
--

/*!40000 ALTER TABLE `machineusage` DISABLE KEYS */;
/*!40000 ALTER TABLE `machineusage` ENABLE KEYS */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('INFO','WARNING','ALERT','SUCCESS') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INFO',
  `linkUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_fkey` (`userId`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `paymentMethod` enum('BANK_TRANSFER','DIRECT_DEBIT','CASH','CHECK','CARD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BANK_TRANSFER',
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('CONFIRMED','PENDING','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CONFIRMED',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Payment_paymentNumber_key` (`paymentNumber`),
  KEY `Payment_invoiceId_fkey` (`invoiceId`),
  KEY `Payment_accountId_fkey` (`accountId`),
  CONSTRAINT `Payment_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `financialaccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Payment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('cmv9sqn2e003h7x7cjg30kqz4','PAY-RE-2026-0089','cmv9sqn25003d7x7c9vlrv6on','cmv5nu7ok000v1095xbxjyajx','2026-10-15 17:12:10.310',93569.18,'BANK_TRANSFER','Gutschrift/Zahlung RE-2026-0089',NULL,'CONFIRMED','2026-10-15 17:12:10.311','2026-10-15 17:12:10.311'),('cmv9sqn2s003n7x7ciprkl5f3','PAY-RE-2026-0090','cmv9sqn2k003j7x7cd68716kk','cmv5nu7ok000v1095xbxjyajx','2026-10-15 17:12:10.323',40000.00,'BANK_TRANSFER','Gutschrift/Zahlung RE-2026-0090',NULL,'CONFIRMED','2026-10-15 17:12:10.324','2026-10-15 17:12:10.324'),('cmv9sqn35003t7x7c8v042znl','PAY-ER-2026-0412','cmv9sqn2w003p7x7ca6fbk2xf','cmv5nu7ok000v1095xbxjyajx','2026-10-15 17:12:10.336',26536.00,'BANK_TRANSFER','Gutschrift/Zahlung ER-2026-0412',NULL,'CONFIRMED','2026-10-15 17:12:10.338','2026-10-15 17:12:10.338');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;

--
-- Table structure for table `pigbatch`
--

DROP TABLE IF EXISTS `pigbatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pigbatch` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batchNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barnType` enum('OUTDOOR_CLIMATE_H4','FATTENING_H2') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OUTDOOR_CLIMATE_H4',
  `barnName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arrivalDate` datetime(3) NOT NULL,
  `initialPigCount` int NOT NULL,
  `currentPigCount` int NOT NULL,
  `targetSlaughterDate` datetime(3) DEFAULT NULL,
  `status` enum('ACTIVE','CLOSED','QUARANTINE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `initialAvgWeightKg` decimal(6,2) NOT NULL DEFAULT '30.00',
  `targetWeightKg` decimal(6,2) NOT NULL DEFAULT '120.00',
  `mortalityCount` int NOT NULL DEFAULT '0',
  `feedConversionRate` decimal(5,2) NOT NULL DEFAULT '2.75',
  `totalDirectCost` decimal(12,2) NOT NULL DEFAULT '0.00',
  `totalRevenue` decimal(12,2) NOT NULL DEFAULT '0.00',
  `grossMargin` decimal(12,2) NOT NULL DEFAULT '0.00',
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PigBatch_batchNumber_key` (`batchNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pigbatch`
--

/*!40000 ALTER TABLE `pigbatch` DISABLE KEYS */;
INSERT INTO `pigbatch` VALUES ('cmv9sqmyc002n7x7c5qfnmvue','MAST-2026-H4-01','OUTDOOR_CLIMATE_H4','Außenklimastall A (Stroh & Kot-Harn-Trennung)','2026-05-10 00:00:00.000',700,686,NULL,'CLOSED',29.50,122.00,14,2.72,104500.00,178200.00,73700.00,'Erfolgreicher Durchgang Haltungsform 4. Hohe Nachfrage und Tierwohl-Prämie (+0,35 €/kg).','2026-10-15 17:12:10.164','2026-10-15 17:12:10.164'),('cmv9sqmyh002o7x7cnpjaejzd','MAST-2026-H4-02','OUTDOOR_CLIMATE_H4','Außenklimastall B (Stroh & Kot-Harn-Trennung)','2026-07-15 00:00:00.000',700,691,NULL,'ACTIVE',30.00,121.50,9,2.74,88400.00,0.00,-88400.00,'Laufender Durchgang. Geplante Schlachtung Ende Oktober 2026.','2026-10-15 17:12:10.169','2026-10-15 17:12:10.169'),('cmv9sqmyl002p7x7c36eep7j0','MAST-2026-H2-01','FATTENING_H2','Schweinemaststall 1 (Haltungsform 2)','2026-04-01 00:00:00.000',1000,978,NULL,'CLOSED',28.50,120.00,22,2.82,138500.00,218400.00,79900.00,'Konventioneller Mastdurchgang abgeschlossen.','2026-10-15 17:12:10.174','2026-10-15 17:12:10.174'),('cmv9sqmyp002q7x7c1d9cmy02','MAST-2026-H2-02','FATTENING_H2','Schweinemaststall 2 (Haltungsform 2)','2026-06-20 00:00:00.000',1000,984,NULL,'ACTIVE',29.00,120.50,16,2.80,112000.00,0.00,-112000.00,'Mastverlauf im Soll. Ausstallung in 3 Wochen vorgesehen.','2026-10-15 17:12:10.178','2026-10-15 17:12:10.178');
/*!40000 ALTER TABLE `pigbatch` ENABLE KEYS */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` enum('BETRIEBSLEITUNG','FINANZVERWALTUNG','ACKERBAULEITUNG','SCHWEINEMASTLEITUNG','MITARBEITER','STEUERBERATER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `displayName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissions` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('cmv5nu7it00001095x5u9a4si','BETRIEBSLEITUNG','Betriebsleitung (Gesa & Dr. Josef Langenberg)','Volle administrative, strategische und finanzielle Leitungsrechte','[\"ALL\", \"FINANCE_READ\", \"FINANCE_WRITE\", \"ADMIN\", \"AUDIT_VIEW\", \"REPORTS_ALL\"]','2026-10-12 19:43:54.005','2026-10-15 17:12:09.664'),('cmv5nu7je00011095t8x3rt6j','FINANZVERWALTUNG','Finanzverwaltung & Buchhaltung','Verwaltung von Buchungen, Rechnungen, Konten und Vorbereitung der DATEV-Daten','[\"FINANCE_READ\", \"FINANCE_WRITE\", \"INVOICES_ALL\", \"BANKING_ALL\", \"REPORTS_FINANCE\"]','2026-10-12 19:43:54.026','2026-10-15 17:12:09.681'),('cmv5nu7ji00021095s8ve0sra','ACKERBAULEITUNG','Ackerbauleitung (Kenneth Makowka)','Verwaltung von Schlägen, Fruchtfolge, Kartoffellager und Maschinenpark','[\"CROPS_ALL\", \"STORAGE_ALL\", \"MACHINES_ALL\", \"REPORTS_AGRAR\"]','2026-10-12 19:43:54.030','2026-10-15 17:12:09.686'),('cmv5nu7jl00031095mik5wh0p','SCHWEINEMASTLEITUNG','Schweinemastleitung','Verwaltung von Mastdurchgängen, Tierbeständen, Futter und Tiergesundheit','[\"LIVESTOCK_ALL\", \"REPORTS_LIVESTOCK\"]','2026-10-12 19:43:54.034','2026-10-15 17:12:09.690'),('cmv5nu7jp000410958r05wnes','MITARBEITER','Mitarbeiter & Auszubildende','Eingeschränkter Zugriff auf Arbeitszeiten und Maschineneinsatz','[\"MACHINES_USAGE\", \"TASKS_VIEW\"]','2026-10-12 19:43:54.038','2026-10-15 17:12:09.694'),('cmv5nu7jt00051095pcxr91l8','STEUERBERATER','Steuerberater / Buchprüfer','Lesezugriff auf Finanzabschlüsse, USt-Voranmeldungen und DATEV-Exporte','[\"FINANCE_READ\", \"REPORTS_READ\", \"DATEV_EXPORT\"]','2026-10-12 19:43:54.041','2026-10-15 17:12:09.698');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;

--
-- Table structure for table `storagelot`
--

DROP TABLE IF EXISTS `storagelot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storagelot` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lotNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cropType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Industriekartoffeln',
  `storageLocation` enum('HALL_1_BULK','HALL_2_BULK','BOX_STORAGE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HALL_1_BULK',
  `harvestYear` int NOT NULL,
  `initialWeightTons` decimal(10,2) NOT NULL,
  `remainingWeightTons` decimal(10,2) NOT NULL,
  `qualityGrade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('IN_STORAGE','DEPLETED','PARTIALLY_SOLD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IN_STORAGE',
  `originFieldInfo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storageLossTons` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StorageLot_lotNumber_key` (`lotNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storagelot`
--

/*!40000 ALTER TABLE `storagelot` DISABLE KEYS */;
INSERT INTO `storagelot` VALUES ('cmv9sqmyx002r7x7cgjn4q5rl','KART-2026-HALLE1-A','Industriekartoffeln (Sorte Innovator)','HALL_1_BULK',2026,2085.00,1350.00,'Stärkegehalt 18,2%','PARTIALLY_SOLD','Schlag Hünenheide Nord (SCH-01)',42.00,'2026-10-15 17:12:10.185','2026-10-15 17:12:10.185'),('cmv9sqmz1002s7x7cmj2xjn8j','KART-2026-HALLE2-B','Industriekartoffeln (Sorte Fontane)','HALL_2_BULK',2026,2380.00,2150.00,'Stärkegehalt 17,9%','IN_STORAGE','Schlag Ridder Esch (SCH-07)',35.00,'2026-10-15 17:12:10.189','2026-10-15 17:12:10.189');
/*!40000 ALTER TABLE `storagelot` ENABLE KEYS */;

--
-- Table structure for table `storagemovement`
--

DROP TABLE IF EXISTS `storagemovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storagemovement` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lotId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `movementType` enum('INCOMING','OUTGOING_SALE','LOSS_SORTING','CLEANING_LOSS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `weightTons` decimal(10,2) NOT NULL,
  `buyerCustomerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pricePerTon` decimal(10,2) DEFAULT NULL,
  `totalAmountNet` decimal(12,2) DEFAULT NULL,
  `destination` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `StorageMovement_lotId_fkey` (`lotId`),
  KEY `StorageMovement_buyerCustomerId_fkey` (`buyerCustomerId`),
  CONSTRAINT `StorageMovement_buyerCustomerId_fkey` FOREIGN KEY (`buyerCustomerId`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `StorageMovement_lotId_fkey` FOREIGN KEY (`lotId`) REFERENCES `storagelot` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storagemovement`
--

/*!40000 ALTER TABLE `storagemovement` DISABLE KEYS */;
/*!40000 ALTER TABLE `storagemovement` ENABLE KEYS */;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplierNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contactName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postalCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vatNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentTermsDays` int NOT NULL DEFAULT '30',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Supplier_supplierNumber_key` (`supplierNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES ('cmv9sqmv0001s7x7ccd53rrwv','LFR-2001','RWG Diepholz-Barnstorf eG','Klaus Eickhoff','bestellung@rwg-diepholz.de','05441/98710','Lüderstraße 14','49406','Barnstorf','DE117765432',NULL,30,'Lieferant für Schweinefutter (Trockenfutter), Mineralien, Saatgut und Mineraldünger.','2026-10-15 17:12:10.044','2026-10-15 17:12:10.044'),('cmv9sqmv4001t7x7c8f2aa31e','LFR-2002','Ferkelerzeugerring Weser-Ems eG','Bernd Albers','ferkel@ferkelring-we.de','04441/8720','Bremer Tor 3','49377','Vechta','DE117799123',NULL,14,'Lieferung von Qualitäts-Ferkeln (Topigs Norsvin / DanBred) mit ca. 28-30 kg.','2026-10-15 17:12:10.049','2026-10-15 17:12:10.049'),('cmv9sqmv8001u7x7cdm1pyvgf','LFR-2003','Tierarztpraxis Dr. med. vet. Meyer & Partner','Dr. Jens Meyer','praxis@tierarzt-meyer.de','05441/3321','Lange Straße 44','49406','Drentwede','DE223344556',NULL,30,'Bestandsbetreuung Schweinemast, Impfprogramme und Tierwohl-Audits.','2026-10-15 17:12:10.052','2026-10-15 17:12:10.052'),('cmv9sqmvc001v7x7c69ag740m','LFR-2004','Raiffeisen Schraders Tankstellen & Energie GmbH','Jörg Schraders','energie@schraders-diesel.de','04246/8920','Sulinger Straße 20','27232','Sulingen','DE118833445',NULL,14,'Lieferung von Agrardiesel (Großtankanlage Hünenheide 15.000 l) und AdBlue.','2026-10-15 17:12:10.056','2026-10-15 17:12:10.056'),('cmv9sqmvg001w7x7c65lnzs3e','LFR-2005','Grimme Landmaschinenfabrik GmbH & Co. KG','Technischer Kundendienst Damme','service@grimme.de','05491/6660','Hunteburger Straße 32','49401','Damme','DE117788990',NULL,30,'Ersatzteile, Wartung und Verschleißteile für Grimme SE 260 Roder und Lagertechnik.','2026-10-15 17:12:10.060','2026-10-15 17:12:10.060'),('cmv9sqmvk001x7x7c8b01w895','LFR-2006','Fendt Vertriebszentrum Nord / BSL Landtechnik','Uwe Hagedorn','service@bsl-landtechnik.de','04271/8050','Handelsweg 4','27211','Bassum','DE116677889',NULL,30,'Wartung, TÜV und Inspektionen für Fendt Schlepperflotte.','2026-10-15 17:12:10.065','2026-10-15 17:12:10.065');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;

--
-- Table structure for table `taxrate`
--

DROP TABLE IF EXISTS `taxrate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxrate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ratePercent` decimal(5,2) NOT NULL,
  `isAgriculturalFlatRate` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `TaxRate_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taxrate`
--

/*!40000 ALTER TABLE `taxrate` DISABLE KEYS */;
INSERT INTO `taxrate` VALUES ('cmv9sqmqx000v7x7c2dd92u8z','UST19','Regelsteuersatz 19%',19.00,0,1,'2026-10-15 17:12:09.898'),('cmv9sqmr1000w7x7ckx9ueqw6','UST07','Ermäßigter Steuersatz 7%',7.00,0,1,'2026-10-15 17:12:09.902'),('cmv9sqmr5000x7x7c0792gjyg','UST_AGRAR','Pauschalierung Landwirtschaft 10,7% (§ 24 UStG)',10.70,1,1,'2026-10-15 17:12:09.906'),('cmv9sqmr9000y7x7cnsj15ypd','UST00','Steuerfrei 0% (Innergemeinschaftlich)',0.00,0,1,'2026-10-15 17:12:09.910');
/*!40000 ALTER TABLE `taxrate` ENABLE KEYS */;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transactionNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('REVENUE','EXPENSE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `categoryKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amountNet` decimal(12,2) NOT NULL,
  `vatRate` decimal(5,2) NOT NULL DEFAULT '19.00',
  `vatAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `amountGross` decimal(12,2) NOT NULL,
  `accountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplierId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activity` enum('GENERAL','CROPS','LIVESTOCK','POTATO_STORAGE','MACHINERY','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL',
  `paymentMethod` enum('BANK_TRANSFER','DIRECT_DEBIT','CASH','CHECK','CARD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BANK_TRANSFER',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CLEARED',
  `receiptUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDemo` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Transaction_transactionNumber_key` (`transactionNumber`),
  KEY `Transaction_accountId_fkey` (`accountId`),
  KEY `Transaction_customerId_fkey` (`customerId`),
  KEY `Transaction_supplierId_fkey` (`supplierId`),
  KEY `Transaction_invoiceId_fkey` (`invoiceId`),
  CONSTRAINT `Transaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `financialaccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Transaction_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Transaction_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Transaction_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES ('cmv9sqn3k003z7x7c52eea5mp','TRX-2026-10-001','REVENUE','2026-10-01 00:00:00.000','REV_POTATO_SALES','Zahlung Emsland Stärke RE-2026-0089',84525.00,10.70,9044.18,93569.18,'cmv5nu7ok000v1095xbxjyajx','cmv9sqmue001o7x7cdl2udf0v',NULL,NULL,'POTATO_STORAGE','BANK_TRANSFER','CLEARED',NULL,NULL,1,'2026-10-15 17:12:10.352','2026-10-15 17:12:10.352'),('cmv9sqn3q00417x7cj8b08c00','TRX-2026-10-002','REVENUE','2026-10-05 00:00:00.000','REV_PIG_SALES','Abschlagszahlung Vion Zucht- und Nutzvieh RE-2026-0090',36133.69,10.70,3866.31,40000.00,'cmv5nu7ok000v1095xbxjyajx','cmv9sqmuj001p7x7cx1d2om4x',NULL,NULL,'LIVESTOCK','BANK_TRANSFER','CLEARED',NULL,NULL,1,'2026-10-15 17:12:10.358','2026-10-15 17:12:10.358'),('cmv9sqn3u00437x7cmj3qknct','TRX-2026-10-003','EXPENSE','2026-10-03 00:00:00.000','EXP_FEED','Überweisung Futter RWG Diepholz ER-2026-0412',24800.00,7.00,1736.00,26536.00,'cmv5nu7ok000v1095xbxjyajx',NULL,'cmv9sqmv0001s7x7ccd53rrwv',NULL,'LIVESTOCK','BANK_TRANSFER','CLEARED',NULL,NULL,1,'2026-10-15 17:12:10.362','2026-10-15 17:12:10.362'),('cmv9sqn3z00457x7con80na4g','TRX-2026-10-004','EXPENSE','2026-10-06 00:00:00.000','EXP_VET','Tierarztpraxis Dr. Meyer Tiergesundheitskontrolle',2150.00,19.00,408.50,2558.50,'cmv5nu7ok000v1095xbxjyajx',NULL,'cmv9sqmv8001u7x7cdm1pyvgf',NULL,'LIVESTOCK','BANK_TRANSFER','CLEARED',NULL,NULL,1,'2026-10-15 17:12:10.367','2026-10-15 17:12:10.367'),('cmv9sqn4300477x7c53iuq89o','TRX-2026-10-005','EXPENSE','2026-10-08 00:00:00.000','EXP_MACHINERY_REPAIR','Grimme Damme Wartung SE 260 Roderkette & Bänder',3420.00,19.00,649.80,4069.80,'cmv5nu7ok000v1095xbxjyajx',NULL,'cmv9sqmvg001w7x7c65lnzs3e',NULL,'MACHINERY','BANK_TRANSFER','CLEARED',NULL,NULL,1,'2026-10-15 17:12:10.371','2026-10-15 17:12:10.371'),('cmv9sqn4800497x7cuf5xx089','TRX-2026-10-006','EXPENSE','2026-10-09 00:00:00.000','EXP_WAGES','Monatsgehälter Mitarbeiter Landwirtschaft & Büro',22630.00,0.00,0.00,22630.00,'cmv5nu7ok000v1095xbxjyajx',NULL,NULL,NULL,'GENERAL','BANK_TRANSFER','CLEARED',NULL,NULL,1,'2026-10-15 17:12:10.376','2026-10-15 17:12:10.376');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;

--
-- Table structure for table `transactioncategory`
--

DROP TABLE IF EXISTS `transactioncategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactioncategory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameDe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameEn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameFr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('REVENUE','EXPENSE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `defaultVatRate` decimal(5,2) NOT NULL DEFAULT '19.00',
  `isSystem` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `TransactionCategory_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactioncategory`
--

/*!40000 ALTER TABLE `transactioncategory` DISABLE KEYS */;
INSERT INTO `transactioncategory` VALUES ('cmv9sqmri000z7x7cdqbkm8ng','REV_PIG_SALES','Verkauf Mastschweine','Pig Fattening Sales','Vente porcs charcutiers','REVENUE',10.70,1,'2026-10-15 17:12:09.918'),('cmv9sqmrn00107x7cslraqd15','REV_POTATO_SALES','Verkauf Industriekartoffeln','Industrial Potato Sales','Vente pommes de terre féculières','REVENUE',10.70,1,'2026-10-15 17:12:09.923'),('cmv9sqmrr00117x7cilptqjz4','REV_GRAIN_SALES','Verkauf Getreide (Weizen/Gerste)','Grain Sales (Wheat/Barley)','Vente céréales','REVENUE',10.70,1,'2026-10-15 17:12:09.927'),('cmv9sqmrv00127x7c42l5mwrk','REV_RAPESEED_SALES','Verkauf Raps','Rapeseed Sales','Vente colza','REVENUE',10.70,1,'2026-10-15 17:12:09.931'),('cmv9sqmrz00137x7cl9k823q4','REV_SUGARBEET_SALES','Verkauf Zuckerrüben','Sugar Beet Sales','Vente betteraves sucrières','REVENUE',10.70,1,'2026-10-15 17:12:09.935'),('cmv9sqms300147x7cdrtlzenm','REV_SUBSIDIES','Agrarförderung & Direktzahlungen','Agricultural Subsidies','Aides PAC & Subventions','REVENUE',0.00,1,'2026-10-15 17:12:09.939'),('cmv9sqms700157x7casqtcmn2','REV_OTHER','Sonstige betriebliche Erlöse','Other Operating Revenue','Autres recettes d exploitation','REVENUE',19.00,1,'2026-10-15 17:12:09.943'),('cmv9sqmsb00167x7c4iltll68','EXP_FEED','Aliments pour porcs (Futtermittel)','Pig Feed Supplies','Aliments pour porcs','EXPENSE',7.00,1,'2026-10-15 17:12:09.947'),('cmv9sqmse00177x7ciykz1mj7','EXP_PIGLETS','Ferkelkauf (Achat d animaux)','Piglet Purchases','Achat de porcelets','EXPENSE',10.70,1,'2026-10-15 17:12:09.951'),('cmv9sqmsi00187x7c0xa1fv86','EXP_VET','Tierarzt & Medikamente','Veterinary & Medication','Frais vétérinaires','EXPENSE',19.00,1,'2026-10-15 17:12:09.954'),('cmv9sqmsl00197x7c5gprs12m','EXP_STRAW','Stroh & Einstreu (Litière)','Straw & Bedding','Paille & litière','EXPENSE',7.00,1,'2026-10-15 17:12:09.958'),('cmv9sqmsp001a7x7cfsm5w0c7','EXP_SEEDS','Saatgut (Semences)','Seeds','Semences','EXPENSE',7.00,1,'2026-10-15 17:12:09.962'),('cmv9sqmsu001b7x7cida5m62n','EXP_FERTILIZER','Mineraldünger & Nährstoffe','Mineral Fertilizers','Engrais & fertilisants','EXPENSE',19.00,1,'2026-10-15 17:12:09.966'),('cmv9sqmsx001c7x7cv093ytiv','EXP_PESTICIDES','Pflanzenschutzmittel','Crop Protection & Pesticides','Produits phytosanitaires','EXPENSE',19.00,1,'2026-10-15 17:12:09.970'),('cmv9sqmt2001d7x7cu12dj441','EXP_FUEL','Diesel & Kraftstoffe','Diesel & Fuel','Carburant & diesel agricole','EXPENSE',19.00,1,'2026-10-15 17:12:09.974'),('cmv9sqmt6001e7x7csuxn790r','EXP_ENERGY','Strom & Wasser (Énergie)','Electricity & Water','Électricité & Eau','EXPENSE',19.00,1,'2026-10-15 17:12:09.978'),('cmv9sqmta001f7x7cbrvu4b20','EXP_MACHINERY_REPAIR','Maschineninstandhaltung & Reparaturen','Machinery Maintenance & Repair','Entretien & réparations engins','EXPENSE',19.00,1,'2026-10-15 17:12:09.982'),('cmv9sqmte001g7x7c7b07s6gw','EXP_SPARE_PARTS','Ersatzteile & Werkstatt','Spare Parts & Workshop','Pièces détachées','EXPENSE',19.00,1,'2026-10-15 17:12:09.986'),('cmv9sqmti001h7x7c9vg9czf4','EXP_CONTRACTORS','Lohnunternehmer & Agrarservice','Contractors & Machinery Ring','Prestataires agricoles / ETA','EXPENSE',19.00,1,'2026-10-15 17:12:09.990'),('cmv9sqmtm001i7x7cnn1kjflm','EXP_RENT','Pacht & Mieten (Fermages)','Land Lease & Rent','Fermages & locations de terres','EXPENSE',0.00,1,'2026-10-15 17:12:09.994'),('cmv9sqmtq001j7x7czaf6zv10','EXP_INSURANCE','Versicherungen (Hagel, Gebäude, Fuhrpark)','Insurances','Assurances agricoles','EXPENSE',19.00,1,'2026-10-15 17:12:09.998'),('cmv9sqmtu001k7x7c9u1lhuz8','EXP_WAGES','Löhne & Sozialabgaben','Wages & Social Security','Salaires & charges sociales','EXPENSE',0.00,1,'2026-10-15 17:12:10.003'),('cmv9sqmty001l7x7cs0x0d168','EXP_INTEREST','Zinsaufwand Darlehen','Loan Interest','Intérêts d emprunt','EXPENSE',0.00,1,'2026-10-15 17:12:10.006'),('cmv9sqmu2001m7x7ckuu4q7mp','EXP_ADMIN','Verwaltung, Beratung & Software','Administration & Advisory','Frais administratifs & conseil','EXPENSE',19.00,1,'2026-10-15 17:12:10.010'),('cmv9sqmu6001n7x7cv42cgpri','EXP_OTHER','Sonstige betriebliche Aufwendungen','Other Operating Expenses','Autres dépenses','EXPENSE',19.00,1,'2026-10-15 17:12:10.014');
/*!40000 ALTER TABLE `transactioncategory` ENABLE KEYS */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_roleId_fkey` (`roleId`),
  CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('cmv5nu7mg000710954fqzn498','gesa.langenberg@lampe-agrar.de','$2a$10$HNgWrN12Rbs5R4s60Zlj2O/MRMJ4VRVVQzpcAb1sz6pX5D5HavcUy','Gesa Langenberg','cmv5nu7it00001095x5u9a4si',NULL,1,'2026-10-12 19:43:54.136','2026-10-15 17:12:09.798'),('cmv5nu7n1000b109529jrcfqa','josef.langenberg@lampe-agrar.de','$2a$10$HNgWrN12Rbs5R4s60Zlj2O/MRMJ4VRVVQzpcAb1sz6pX5D5HavcUy','Dr. Josef Langenberg','cmv5nu7it00001095x5u9a4si',NULL,1,'2026-10-12 19:43:54.157','2026-10-15 17:12:09.818'),('cmv5nu7na000f10950lf4l6i6','kenneth.makowka@lampe-agrar.de','$2a$10$HNgWrN12Rbs5R4s60Zlj2O/MRMJ4VRVVQzpcAb1sz6pX5D5HavcUy','Kenneth Makowka','cmv5nu7ji00021095s8ve0sra',NULL,1,'2026-10-12 19:43:54.166','2026-10-15 17:12:09.827'),('cmv5nu7ni000j1095zqohypd7','finanzen@lampe-agrar.de','$2a$10$HNgWrN12Rbs5R4s60Zlj2O/MRMJ4VRVVQzpcAb1sz6pX5D5HavcUy','Helga Meyer','cmv5nu7je00011095t8x3rt6j',NULL,1,'2026-10-12 19:43:54.174','2026-10-15 17:12:09.836'),('cmv5nu7nq000n1095p8hd4l2v','schweinemast@lampe-agrar.de','$2a$10$HNgWrN12Rbs5R4s60Zlj2O/MRMJ4VRVVQzpcAb1sz6pX5D5HavcUy','Torsten Brinkmann','cmv5nu7jl00031095mik5wh0p',NULL,1,'2026-10-12 19:43:54.183','2026-10-15 17:12:09.845'),('cmv5nu7o0000r109592jorp4s','berater@steuerbuero-diepholz.de','$2a$10$HNgWrN12Rbs5R4s60Zlj2O/MRMJ4VRVVQzpcAb1sz6pX5D5HavcUy','Dr. Klaus Vormweg (Steuerberater)','cmv5nu7jt00051095pcxr91l8',NULL,1,'2026-10-12 19:43:54.192','2026-10-15 17:12:09.855');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

--
-- Table structure for table `userpreference`
--

DROP TABLE IF EXISTS `userpreference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpreference` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'de',
  `animationsEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `defaultCurrency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EUR',
  `timezone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Europe/Berlin',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserPreference_userId_key` (`userId`),
  CONSTRAINT `UserPreference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpreference`
--

/*!40000 ALTER TABLE `userpreference` DISABLE KEYS */;
INSERT INTO `userpreference` VALUES ('cmv5nu7mv00091095rrssdun5','cmv5nu7mg000710954fqzn498','de',1,'EUR','Europe/Berlin','2026-10-12 19:43:54.152','2026-10-15 17:12:09.813'),('cmv5nu7n5000d10958qcqr9mi','cmv5nu7n1000b109529jrcfqa','de',1,'EUR','Europe/Berlin','2026-10-12 19:43:54.161','2026-10-15 17:12:09.823'),('cmv5nu7ne000h10952d5m56ek','cmv5nu7na000f10950lf4l6i6','de',1,'EUR','Europe/Berlin','2026-10-12 19:43:54.170','2026-10-15 17:12:09.831'),('cmv5nu7nm000l109560j8u2ms','cmv5nu7ni000j1095zqohypd7','de',1,'EUR','Europe/Berlin','2026-10-12 19:43:54.178','2026-10-15 17:12:09.840'),('cmv5nu7nv000p1095ph28rxgh','cmv5nu7nq000n1095p8hd4l2v','de',1,'EUR','Europe/Berlin','2026-10-12 19:43:54.187','2026-10-15 17:12:09.850'),('cmv5nu7o5000t1095rb19vlj0','cmv5nu7o0000r109592jorp4s','de',1,'EUR','Europe/Berlin','2026-10-12 19:43:54.197','2026-10-15 17:12:09.860');
/*!40000 ALTER TABLE `userpreference` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-26  7:34:00
