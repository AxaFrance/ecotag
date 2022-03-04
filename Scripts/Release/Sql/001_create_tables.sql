USE [EcotagContent]
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
    [GPU_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [GRP_Id] uniqueidentifier NOT NULL,
    [USR_Id] uniqueidentifier NOT NULL
    CONSTRAINT [PK_T_GroupUsers] UNIQUE([GPU_Id])
    )
END

GO