-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: symfony
-- ------------------------------------------------------
-- Server version	5.5.49-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dt_category`
--

DROP TABLE IF EXISTS `dt_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `label` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_category`
--

LOCK TABLES `dt_category` WRITE;
/*!40000 ALTER TABLE `dt_category` DISABLE KEYS */;
INSERT INTO `dt_category` VALUES (1,'uncategorized','Uncategorized',NULL);
/*!40000 ALTER TABLE `dt_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_comment`
--

DROP TABLE IF EXISTS `dt_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `author_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `author_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `author_url` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author_ip_address` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `subscribe` tinyint(1) NOT NULL,
  `status` smallint(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_13D732DD4B89032C` (`post_id`),
  KEY `IDX_13D732DD727ACA70` (`parent_id`),
  CONSTRAINT `FK_13D732DD727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `dt_comment` (`id`),
  CONSTRAINT `FK_13D732DD4B89032C` FOREIGN KEY (`post_id`) REFERENCES `dt_post` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_comment`
--

LOCK TABLES `dt_comment` WRITE;
/*!40000 ALTER TABLE `dt_comment` DISABLE KEYS */;
INSERT INTO `dt_comment` VALUES (1,1,NULL,'admin','admin@drafterbit.org',NULL,NULL,'This is test comment.','2016-05-13 10:35:31','2016-05-13 10:35:31',NULL,0,1);
/*!40000 ALTER TABLE `dt_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_group`
--

DROP TABLE IF EXISTS `dt_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `roles` longtext COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_7F9E8CEA5E237E06` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_group`
--

LOCK TABLES `dt_group` WRITE;
/*!40000 ALTER TABLE `dt_group` DISABLE KEYS */;
INSERT INTO `dt_group` VALUES (1,'Administrator','a:1:{i:0;s:16:\"ROLE_SUPER_ADMIN\";}',NULL);
/*!40000 ALTER TABLE `dt_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_log`
--

DROP TABLE IF EXISTS `dt_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `level` int(11) NOT NULL,
  `message` longtext COLLATE utf8_unicode_ci NOT NULL,
  `time` int(11) NOT NULL,
  `context` longtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_log`
--

LOCK TABLES `dt_log` WRITE;
/*!40000 ALTER TABLE `dt_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `dt_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_menu`
--

DROP TABLE IF EXISTS `dt_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `display_text` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_menu`
--

LOCK TABLES `dt_menu` WRITE;
/*!40000 ALTER TABLE `dt_menu` DISABLE KEYS */;
INSERT INTO `dt_menu` VALUES (1,'main');
/*!40000 ALTER TABLE `dt_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_menu_item`
--

DROP TABLE IF EXISTS `dt_menu_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_menu_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `display_text` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sequence` smallint(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_6738AC52CCD7E912` (`menu_id`),
  KEY `IDX_6738AC52727ACA70` (`parent_id`),
  CONSTRAINT `FK_6738AC52727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `dt_menu_item` (`id`),
  CONSTRAINT `FK_6738AC52CCD7E912` FOREIGN KEY (`menu_id`) REFERENCES `dt_menu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_menu_item`
--

LOCK TABLES `dt_menu_item` WRITE;
/*!40000 ALTER TABLE `dt_menu_item` DISABLE KEYS */;
INSERT INTO `dt_menu_item` VALUES (1,1,NULL,'Home','%base_url%',0),(2,1,NULL,'Sample Page','%base_url%/sample-page',0);
/*!40000 ALTER TABLE `dt_menu_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_page`
--

DROP TABLE IF EXISTS `dt_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `layout` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_FD2BC979A76ED395` (`user_id`),
  CONSTRAINT `FK_FD2BC979A76ED395` FOREIGN KEY (`user_id`) REFERENCES `dt_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_page`
--

LOCK TABLES `dt_page` WRITE;
/*!40000 ALTER TABLE `dt_page` DISABLE KEYS */;
INSERT INTO `dt_page` VALUES (1,1,'Sample Page','sample-page','This is sample page to be edited or removed','2016-05-13 10:35:31','2016-05-13 10:35:31',NULL,'default.html.twig',1);
/*!40000 ALTER TABLE `dt_page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_panel`
--

DROP TABLE IF EXISTS `dt_panel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_panel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `position` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `sequence` int(11) NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `title` longtext COLLATE utf8_unicode_ci,
  `context` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `IDX_B0F31B20A76ED395` (`user_id`),
  CONSTRAINT `FK_B0F31B20A76ED395` FOREIGN KEY (`user_id`) REFERENCES `dt_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_panel`
--

LOCK TABLES `dt_panel` WRITE;
/*!40000 ALTER TABLE `dt_panel` DISABLE KEYS */;
INSERT INTO `dt_panel` VALUES (1,1,'left',0,'Shortcut',1,'Shortcut',NULL),(2,1,'left',1,'RecentComment',1,'Recent Comment',NULL),(3,1,'right',0,'Info',1,'Info',NULL),(4,1,'right',1,'Log',1,'Recent Activity','{\"num\":10}');
/*!40000 ALTER TABLE `dt_panel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_post`
--

DROP TABLE IF EXISTS `dt_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci,
  `type` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `published_at` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_B3AB13D4A76ED395` (`user_id`),
  CONSTRAINT `FK_B3AB13D4A76ED395` FOREIGN KEY (`user_id`) REFERENCES `dt_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_post`
--

LOCK TABLES `dt_post` WRITE;
/*!40000 ALTER TABLE `dt_post` DISABLE KEYS */;
INSERT INTO `dt_post` VALUES (1,1,'Hello World','hello-world','This is hello world to be edited or removed','standard','2016-05-13 10:35:31','2016-05-13 10:35:31',NULL,'2016-05-13 10:35:31',1);
/*!40000 ALTER TABLE `dt_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_post_category`
--

DROP TABLE IF EXISTS `dt_post_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_post_category` (
  `post_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`post_id`,`category_id`),
  KEY `IDX_4AA19C134B89032C` (`post_id`),
  KEY `IDX_4AA19C1312469DE2` (`category_id`),
  CONSTRAINT `FK_4AA19C1312469DE2` FOREIGN KEY (`category_id`) REFERENCES `dt_category` (`id`),
  CONSTRAINT `FK_4AA19C134B89032C` FOREIGN KEY (`post_id`) REFERENCES `dt_post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_post_category`
--

LOCK TABLES `dt_post_category` WRITE;
/*!40000 ALTER TABLE `dt_post_category` DISABLE KEYS */;
INSERT INTO `dt_post_category` VALUES (1,1);
/*!40000 ALTER TABLE `dt_post_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_post_tag`
--

DROP TABLE IF EXISTS `dt_post_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_post_tag` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `IDX_E62F1A8A4B89032C` (`post_id`),
  KEY `IDX_E62F1A8ABAD26311` (`tag_id`),
  CONSTRAINT `FK_E62F1A8ABAD26311` FOREIGN KEY (`tag_id`) REFERENCES `dt_tag` (`id`),
  CONSTRAINT `FK_E62F1A8A4B89032C` FOREIGN KEY (`post_id`) REFERENCES `dt_post` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_post_tag`
--

LOCK TABLES `dt_post_tag` WRITE;
/*!40000 ALTER TABLE `dt_post_tag` DISABLE KEYS */;
INSERT INTO `dt_post_tag` VALUES (1,1);
/*!40000 ALTER TABLE `dt_post_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_system`
--

DROP TABLE IF EXISTS `dt_system`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(155) COLLATE utf8_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_system`
--

LOCK TABLES `dt_system` WRITE;
/*!40000 ALTER TABLE `dt_system` DISABLE KEYS */;
INSERT INTO `dt_system` VALUES (1,'system.site_name','My Awesome Website'),(2,'system.site_description','Just an Awesome DrafTerbit Website'),(3,'system.frontpage','blog'),(4,'system.date_format','d m Y'),(5,'system.time_format','H:i'),(6,'theme.active','feather'),(7,'theme.feather.menu','{\"main\":\"1\",\"side\":\"0\"}');
/*!40000 ALTER TABLE `dt_system` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_tag`
--

DROP TABLE IF EXISTS `dt_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `label` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_tag`
--

LOCK TABLES `dt_tag` WRITE;
/*!40000 ALTER TABLE `dt_tag` DISABLE KEYS */;
INSERT INTO `dt_tag` VALUES (1,'test tag','Test Tag');
/*!40000 ALTER TABLE `dt_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_user`
--

DROP TABLE IF EXISTS `dt_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `username_canonical` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email_canonical` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `salt` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `locked` tinyint(1) NOT NULL,
  `expired` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `confirmation_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_requested_at` datetime DEFAULT NULL,
  `roles` longtext COLLATE utf8_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  `credentials_expired` tinyint(1) NOT NULL,
  `credentials_expire_at` datetime DEFAULT NULL,
  `realname` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bio` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_64B2A91092FC23A8` (`username_canonical`),
  UNIQUE KEY `UNIQ_64B2A910A0D96FBF` (`email_canonical`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_user`
--

LOCK TABLES `dt_user` WRITE;
/*!40000 ALTER TABLE `dt_user` DISABLE KEYS */;
INSERT INTO `dt_user` VALUES (1,'admin','admin','admin@drafterbit.org','admin@drafterbit.org',1,'rrnuc3cokb4cww4sgkk0ko0kowo8sg4','wYr6ZYV8zgrOO3IGRufDJUBFyn02G502eDlJBhNeNu6ql5nZyCUYTZWdwTLddVOt/zog6nARESCEhjY2ciesUg==',NULL,0,0,NULL,NULL,NULL,'a:1:{i:0;s:10:\"ROLE_ADMIN\";}',0,NULL,'admin',NULL,NULL);
/*!40000 ALTER TABLE `dt_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_user_group`
--

DROP TABLE IF EXISTS `dt_user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_user_group` (
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  KEY `IDX_61BCB2C8A76ED395` (`user_id`),
  KEY `IDX_61BCB2C8FE54D947` (`group_id`),
  CONSTRAINT `FK_61BCB2C8FE54D947` FOREIGN KEY (`group_id`) REFERENCES `dt_group` (`id`),
  CONSTRAINT `FK_61BCB2C8A76ED395` FOREIGN KEY (`user_id`) REFERENCES `dt_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_user_group`
--

LOCK TABLES `dt_user_group` WRITE;
/*!40000 ALTER TABLE `dt_user_group` DISABLE KEYS */;
INSERT INTO `dt_user_group` VALUES (1,1);
/*!40000 ALTER TABLE `dt_user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dt_widget`
--

DROP TABLE IF EXISTS `dt_widget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dt_widget` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `theme` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `position` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `sequence` int(11) NOT NULL,
  `context` longtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dt_widget`
--

LOCK TABLES `dt_widget` WRITE;
/*!40000 ALTER TABLE `dt_widget` DISABLE KEYS */;
INSERT INTO `dt_widget` VALUES (1,'search','feather','Sidebar',0,'{\"title\":\"Search\"}'),(2,'meta','feather','Sidebar',1,'{\"title\":\"Meta\"}');
/*!40000 ALTER TABLE `dt_widget` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-13 10:37:09
