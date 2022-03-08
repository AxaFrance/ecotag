
USE [master]

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

/****** Object:  Table [sch_ECOTAG].[T_User] ******/
if not exists (select * from sysobjects where name='T_User' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_User](
    [USR_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [USR_Email] [varchar](254) NOT NULL,
    [USR_Subject] [varchar](16) NOT NULL,
    CONSTRAINT [PK_T_User] UNIQUE([USR_Id]),
    CONSTRAINT [PK_T_User_Email] UNIQUE([USR_Email]),
    CONSTRAINT [PK_T_User_Subject] UNIQUE([USR_Subject])
    )
END

GO 

/****** Object:  Table [sch_ECOTAG].[T_Group] ******/
if not exists (select * from sysobjects where name='T_Group' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Group](
    [GRP_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [GRP_Name] [varchar](16) NOT NULL,
    CONSTRAINT [PK_T_Group] UNIQUE([GRP_Id]),
    CONSTRAINT [PK_T_Group_Name] UNIQUE([GRP_Name]),
    )
END

GO

/****** Object:  Table [sch_ECOTAG].[T_GroupUsers] ******/
if not exists (select * from sysobjects where name='T_GroupUsers' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_GroupUsers](
    [GPU_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [GRP_Id] uniqueidentifier NOT NULL,
    [USR_Id] uniqueidentifier NOT NULL
    CONSTRAINT [PK_T_GroupUsers] UNIQUE([GPU_Id])
    )
END

GO

CREATE CLUSTERED INDEX [IND_GroupName] ON [sch_ECOTAG].[T_Group]
(
    [GRP_Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_UserSubject] ON [sch_ECOTAG].[T_User]
(
    [USR_Subject] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

DECLARE @firstUserId uniqueidentifier
DECLARE @secondUserId uniqueidentifier
DECLARE @thirdUserId uniqueidentifier

DECLARE @firstGroupId uniqueidentifier
DECLARE @secondGroupId uniqueidentifier
DECLARE @thirdGroupId uniqueidentifier

SET @firstUserId = newid()
SET @secondUserId = newid()
SET @thirdUserId = newid()

SET @firstGroupId = newid()
SET @secondGroupId = newid()
SET @thirdGroupId = newid()

INSERT INTO [sch_ECOTAG].[T_User]([USR_Id],[USR_Email],[USR_Subject]) VALUES (@firstUserId,"first@gmail.com","S111111")
INSERT INTO [sch_ECOTAG].[T_User]([USR_Id],[USR_Email],[USR_Subject]) VALUES (@secondUserId,"second@gmail.com","S222222")
INSERT INTO [sch_ECOTAG].[T_User]([USR_Id],[USR_Email],[USR_Subject]) VALUES (@thirdUserId,"third@gmail.com","S333333")

INSERT INTO [sch_ECOTAG].[T_Group]([GRP_Id],[GRP_Name]) VALUES (@firstGroupId, "firstgroup")
INSERT INTO [sch_ECOTAG].[T_Group]([GRP_Id],[GRP_Name]) VALUES (@secondGroupId, "secondgroup")
INSERT INTO [sch_ECOTAG].[T_Group]([GRP_Id],[GRP_Name]) VALUES (@thirdGroupId, "thirdgroup")

INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @firstGroupId, @firstUserId)
INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @firstGroupId, @secondUserId)
INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @firstGroupId, @thirdUserId)
INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @secondGroupId, @secondUserId)

GO

USE [ecotag]
GO
