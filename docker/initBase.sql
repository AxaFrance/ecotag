
USE [master]

CREATE DATABASE EcotagContent
 ON  PRIMARY 
( NAME = N'EcotagContent_primary_01', FILENAME = N'/var/opt/mssql/data/EcotagContent_primary_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB ),
( NAME = N'fg_dat01', FILENAME = N'/var/opt/mssql/data/EcotagContent_dat_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB ),
( NAME = N'fg_idx01', FILENAME = N'/var/opt/mssql/data/EcotagContent_idx_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB ),
( NAME = N'fg_lob01', FILENAME = N'/var/opt/mssql/data/EcotagContent_lob_01.mdf' , SIZE = 100 MB , FILEGROWTH = 10MB )
 LOG ON 
( NAME = N'Log_01_log', FILENAME = N'/var/opt/mssql/data/EcotagContent_log_01.ldf' ,SIZE = 100 MB, MAXSIZE = 500 MB, FILEGROWTH = 50 MB) COLLATE French_CI_AS
GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'EcotagContent')
BEGIN
        ALTER DATABASE [EcotagContent]
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
        ALTER DATABASE [EcotagContent]
            SET AUTO_CLOSE OFF 
            WITH ROLLBACK IMMEDIATE;
END


IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'EcotagContent')
BEGIN
        ALTER DATABASE [EcotagContent]
            SET READ_COMMITTED_SNAPSHOT OFF;
END



IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'EcotagContent')
BEGIN
        ALTER DATABASE [EcotagContent]
            SET AUTO_UPDATE_STATISTICS_ASYNC OFF,
                PAGE_VERIFY NONE,
                DATE_CORRELATION_OPTIMIZATION OFF,
                DISABLE_BROKER,
                PARAMETERIZATION SIMPLE,
                SUPPLEMENTAL_LOGGING OFF 
            WITH ROLLBACK IMMEDIATE;
END

USE EcotagContent
GO
CREATE SCHEMA sch_etg AUTHORIZATION [dbo];
GO

/****** Object:  Table [sch_etg].[T_User] ******/
if not exists (select * from sysobjects where name='T_User' and xtype='U')
BEGIN
CREATE TABLE [sch_etg].[T_User](
    [USR_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [USR_Email] [varchar](254) NOT NULL
    CONSTRAINT [PK_T_User] UNIQUE([USR_Id]))
END

GO 

/****** Object:  Table [sch_etg].[T_Group] ******/
if not exists (select * from sysobjects where name='T_Group' and xtype='U')
BEGIN
CREATE TABLE [sch_etg].[T_Group](
    [GRP_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [GRP_Name] [varchar](16) NOT NULL
    CONSTRAINT [PK_T_Group] UNIQUE([GRP_Id])
)
END

GO

/****** Object:  Table [sch_etg].[T_GroupUsers] ******/
if not exists (select * from sysobjects where name='T_GroupUsers' and xtype='U')
BEGIN
CREATE TABLE [sch_etg].[T_GroupUsers](
    [GPU_Id] uniqueidentifier NOT NULL DEFAULT newid()
    [GRP_Id] uniqueidentifier NOT NULL,
    [USR_Id] uniqueidentifier NOT NULL
    CONSTRAINT [PK_T_GroupUsers] UNIQUE([GPU_Id])
    )
END

GO

USE [EcotagContent]
GO
