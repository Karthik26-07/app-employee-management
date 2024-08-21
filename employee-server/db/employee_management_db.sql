/*
SQLyog Community v13.1.8 (64 bit)
MySQL - 8.0.36 : Database - employee_management
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`employee_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `employee_management`;

/*Table structure for table `leave` */

DROP TABLE IF EXISTS `leave`;

CREATE TABLE `leave` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `sl` int NOT NULL DEFAULT '0',
  `cl` int NOT NULL DEFAULT '0',
  `total_leaves` int NOT NULL DEFAULT '0',
  `is_active` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `leave` */

/*Table structure for table `leave_applications` */

DROP TABLE IF EXISTS `leave_applications`;

CREATE TABLE `leave_applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `leave_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int NOT NULL DEFAULT '0',
  `description` text,
  `status` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `leave_applications` */

/*Table structure for table `salary` */

DROP TABLE IF EXISTS `salary`;

CREATE TABLE `salary` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `basic` double NOT NULL DEFAULT '0',
  `da` double NOT NULL DEFAULT '0',
  `ta` double NOT NULL DEFAULT '0',
  `gross_salary` double NOT NULL DEFAULT '0',
  `is_active` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `salary` */

/*Table structure for table `task` */

DROP TABLE IF EXISTS `task`;

CREATE TABLE `task` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `team_id` bigint NOT NULL,
  `lead_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `task_title` text NOT NULL,
  `task_description` longtext NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `task` */

/*Table structure for table `team` */

DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `team_lead` bigint NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `team` */

/*Table structure for table `team_members` */

DROP TABLE IF EXISTS `team_members`;

CREATE TABLE `team_members` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `team_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `team_members` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_type` varchar(10) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `contact` varchar(12) NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` longtext NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` text,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`user_type`,`name`,`contact`,`email`,`address`,`password`,`image`,`is_active`,`created_at`,`updated_at`) values 
(1,'ADMIN','admin','1234567890','admin@example.com','admin address','$2a$10$YHtZ/2Uy.8OqWLwHhHYOqe9Y0J.38R9IrU4Hfn8Snnq2z.JAdbAmy',NULL,1,'2024-07-24 15:24:27',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
