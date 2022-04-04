
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
    [GRP_CreatorNameIdentifier] [varchar](32) NOT NULL,
    [GRP_CreateDate] BIGINT NOT NULL,
    [GRP_UpdateDate] BIGINT NOT NULL,
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

/****** Object:  Table [sch_ECOTAG].[T_Dataset] ******/
if not exists (select * from sysobjects where name='T_Dataset' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Dataset](
    [DTS_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [DTS_Name] [varchar](16) NOT NULL,
    [DTS_Type] int NOT NULL,
    [DTS_Classification] int NOT NULL,
    [GRP_Id] uniqueidentifier NOT NULL,
    [DTS_CreatorNameIdentifier] [varchar](32) NOT NULL,
    [DTS_CreateDate] BIGINT NOT NULL,
    [DTS_IsLocked] bit NULL,
    CONSTRAINT [PK_T_Dataset] UNIQUE([DTS_Id]),
    CONSTRAINT [PK_T_Dataset_Name] UNIQUE([DTS_Name])
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

GO

/****** Object:  Table [sch_ECOTAG].[T_File] ******/
if not exists (select * from sysobjects where name='T_File' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_File](
    [FLE_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [FLE_Name] [varchar](1024) NOT NULL,
    [FLE_Size] BIGINT NOT NULL,
    [FLE_ContentType] [varchar](256) NOT NULL,
    [FLE_CreatorNameIdentifier] [varchar](32) NOT NULL,
    [FLE_CreateDate] BIGINT NOT NULL,
    [DTS_Id] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_T_File] UNIQUE([FLE_Id])
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

GO


/****** Object:  Table [sch_ECOTAG].[T_Project] ******/
if not exists (select * from sysobjects where name='T_Project' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Project](
    [PRJ_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [PRJ_DatasetId] uniqueidentifier NOT NULL,
    [PRJ_GroupId] uniqueidentifier NOT NULL,
    [PRJ_Name] [varchar](16) NOT NULL,
    [PRJ_NumberCrossAnnotation] [int] NOT NULL CHECK (PRJ_NumberCrossAnnotation between 1 and 10),
    [PRJ_CreateDate] BIGINT NOT NULL,
    [PRJ_AnnotationType] int NOT NULL,
    [PRJ_LabelsJson] [varchar](2048) NOT NULL,
    [PRJ_CreatorNameIdentifier] [varchar](32) NOT NULL,
    CONSTRAINT [PK_T_Project] UNIQUE([PRJ_Id])
    )
END

GO

/****** Object:  Table [sch_ECOTAG].[T_Reservation] ******/
if not exists (select * from sysobjects where name='T_Reservation' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Reservation](
    [RSV_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [FLE_FileId] uniqueidentifier NOT NULL,
    [PRJ_ProjectId] uniqueidentifier NOT NULL,
    [RSV_TimeStamp] BIGINT NOT NULL,
    CONSTRAINT [PK_T_Reservation] UNIQUE([RSV_Id])
    )
END

GO

/****** Object:  Table [sch_ECOTAG].[T_Annotation] ******/
if not exists (select * from sysobjects where name='T_Annotation' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Annotation](
    [ANO_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [FLE_FileId] uniqueidentifier NOT NULL,
    [PRJ_ProjectId] uniqueidentifier NOT NULL,
    [ANO_CreatorNameIdentifier] [varchar](32) NOT NULL,
    [ANO_TimeStamp] BIGINT NOT NULL,
    [ANO_ExpectedOutput] [varchar](4048) NOT NULL,
    CONSTRAINT [PK_T_Annotation] UNIQUE([ANO_Id])
    )
END

GO

/****** Object:  Table [sch_ECOTAG].[T_Audit] ******/
if not exists (select * from sysobjects where name='T_Audit' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Audit](
    [AUD_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [AUD_ElementId] uniqueidentifier NOT NULL,
    [AUD_Type] [varchar](32) NOT NULL,
    [AUD_NameIdentifier] [varchar](32) NOT NULL,
    [AUD_CreateDate] BIGINT NOT NULL,
    [AUD_Diff] [varchar](4048) NOT NULL,
    CONSTRAINT [PK_T_Annotation] UNIQUE([ANO_Id])
    )
END

GO

CREATE CLUSTERED INDEX [IND_AuditElementIdTypeCreateDate] ON [sch_ECOTAG].[T_Audit]
(
    [AUD_ElementId] ASC,
    [AUD_Type] ASC,
    [AUD_CreateDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_AnnotationCreatorNameIdentifier] ON [sch_ECOTAG].[T_Annotation]
(
    [ANO_CreatorNameIdentifier] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_AnnotationProjectId] ON [sch_ECOTAG].[T_Annotation]
(
    [PRJ_ProjectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_ReservationProjectId] ON [sch_ECOTAG].[T_Reservation]
(
    [PRJ_ProjectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_ReservationTimeStamp] ON [sch_ECOTAG].[T_Reservation]
(
    [RSV_TimeStamp] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE UNIQUE INDEX [IND_FileName_DatasetId] ON [sch_ECOTAG].[T_File]
(
    [FLE_Name], [DTS_Id]
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_DatasetIsLocked] ON [sch_ECOTAG].[T_Dataset]
(
    [DTS_IsLocked] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_UserSubject] ON [sch_ECOTAG].[T_User]
(
    [USR_Subject] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

CREATE CLUSTERED INDEX [IND_GroupName] ON [sch_ECOTAG].[T_Group]
(
    [GRP_Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
GO

DECLARE @firstUserId uniqueidentifier
DECLARE @secondUserId uniqueidentifier
DECLARE @thirdUserId uniqueidentifier

DECLARE @firstGroupId uniqueidentifier
DECLARE @secondGroupId uniqueidentifier
DECLARE @thirdGroupId uniqueidentifier

DECLARE @firstProjectId uniqueidentifier
DECLARE @secondProjectId uniqueidentifier
DECLARE @thirdProjectId uniqueidentifier

SET @firstUserId = newid()
SET @secondUserId = newid()
SET @thirdUserId = newid()

SET @firstGroupId = newid()
SET @secondGroupId = newid()
SET @thirdGroupId = newid()

SET @firstProjectId = newid()
SET @secondProjectId = newid()
SET @thirdProjectId = newid()

INSERT INTO [sch_ECOTAG].[T_User]([USR_Id],[USR_Email],[USR_Subject]) VALUES (@firstUserId,"first@gmail.com","S111111")
INSERT INTO [sch_ECOTAG].[T_User]([USR_Id],[USR_Email],[USR_Subject]) VALUES (@secondUserId,"second@gmail.com","S222222")
INSERT INTO [sch_ECOTAG].[T_User]([USR_Id],[USR_Email],[USR_Subject]) VALUES (@thirdUserId,"third@gmail.com","S333333")

INSERT INTO [sch_ECOTAG].[T_Group]([GRP_Id],[GRP_Name],[GRP_CREATORNAMEIDENTIFIER],[GRP_CREATEDATE]) VALUES (@firstGroupId, "firstgroup", "S111111", 637831187822285511)
INSERT INTO [sch_ECOTAG].[T_Group]([GRP_Id],[GRP_Name],[GRP_CREATORNAMEIDENTIFIER],[GRP_CREATEDATE]) VALUES (@secondGroupId, "secondgroup", "S111111", 637831187625235412)
INSERT INTO [sch_ECOTAG].[T_Group]([GRP_Id],[GRP_Name],[GRP_CREATORNAMEIDENTIFIER],[GRP_CREATEDATE]) VALUES (@thirdGroupId, "thirdgroup", "S222222", 637831187822285511)

INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @firstGroupId, @firstUserId)
INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @firstGroupId, @secondUserId)
INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @firstGroupId, @thirdUserId)
INSERT INTO [sch_ECOTAG].[T_GroupUsers]([GPU_Id],[GRP_Id],[USR_Id]) VALUES (newid(), @secondGroupId, @secondUserId)

INSERT INTO [sch_ECOTAG].[T_Project](
    [PRJ_Id],[PRJ_DatasetId],[PRJ_GroupId],[PRJ_Name],[PRJ_NumberCrossAnnotation],[PRJ_CreateDate],[PRJ_AnnotationType],[PRJ_LabelsJson],[PRJ_CreatorNameIdentifier]
) VALUES (
    newid(), newid(), @firstGroupId, "firstproject", 10, 1647129600, 0, '[{"name": "Recto", "color": "#212121", "id": "0"}, {"name": "Verso", "color": "#ffbb00", "id": "1"}, {"name": "Signature", "color": "#f20713", "id": "2"}]',"s666666"
)

GO

USE [ecotag]
GO
