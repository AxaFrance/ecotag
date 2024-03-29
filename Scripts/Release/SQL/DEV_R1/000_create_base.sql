﻿USE [master]

CREATE DATABASE ecotag
ON  PRIMARY
( NAME = N'ecotag_primary_01', FILENAME = N'/var/opt/mssql/data/ecotag_primary_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB ),
( NAME = N'fg_dat01', FILENAME = N'/var/opt/mssql/data/ecotag_dat_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB ),
( NAME = N'fg_idx01', FILENAME = N'/var/opt/mssql/data/ecotag_idx_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB ),
( NAME = N'fg_lob01', FILENAME = N'/var/opt/mssql/data/ecotag_lob_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB )
LOG ON
( NAME = N'Log_01_log', FILENAME = N'/var/opt/mssql/data/ecotag_log_01.ldf' ,SIZE = 100 MB, MAXSIZE = 500 MB, FILEGROWTH = 50 MB) COLLATE French_CI_AS
GO
IF EXISTS (SELECT 1
FROM   [master].[dbo].[sysdatabases]
WHERE  [name] = N'ecotag')
BEGIN
ALTER DATABASE [ecotag]
SET ANSI_NULLS ON,
    ANSI_PADDING ON,
    ANSI_WARNINGS ON,
    ARITHABORT ON,
    CONCAT_NULL_YIELDS_NULL ON,
    NUMERIC_ROUNDABORT OFF,
    QUOTED_IDENTIFIER ON,
    ANSI_NULL_DEFAULT ON,
    CURSOR_DEFAULT LOCAL,
    RECOVERY FULL,
    CURSOR_CLOSE_ON_COMMIT OFF,
    AUTO_CREATE_STATISTICS ON,
    AUTO_SHRINK OFF,
    AUTO_UPDATE_STATISTICS ON,
    RECURSIVE_TRIGGERS OFF
WITH ROLLBACK IMMEDIATE;
ALTER DATABASE [ecotag]
SET AUTO_CLOSE OFF
WITH ROLLBACK IMMEDIATE;
END


IF EXISTS (SELECT 1
FROM   [master].[dbo].[sysdatabases]
WHERE  [name] = N'ecotag')
BEGIN
ALTER DATABASE [ecotag]
SET READ_COMMITTED_SNAPSHOT OFF;
END



IF EXISTS (SELECT 1
FROM   [master].[dbo].[sysdatabases]
WHERE  [name] = N'ecotag')
BEGIN
ALTER DATABASE [ecotag]
SET AUTO_UPDATE_STATISTICS_ASYNC OFF,
    PAGE_VERIFY NONE,
    DATE_CORRELATION_OPTIMIZATION OFF,
    DISABLE_BROKER,
    PARAMETERIZATION SIMPLE,
    SUPPLEMENTAL_LOGGING OFF
WITH ROLLBACK IMMEDIATE;
END

USE ecotag
GO
CREATE SCHEMA sch_ECOTAG AUTHORIZATION [dbo];
GO