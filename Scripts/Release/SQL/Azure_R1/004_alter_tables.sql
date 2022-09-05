USE [ECOTAG]
GO

/****** Object:  Table [sch_ECOTAG].[T_User] ******/
ALTER TABLE [sch_ECOTAG].[T_User] ALTER COLUMN [USR_NameIdentifier] [varchar](64) NOT NULL;
GO

ALTER TABLE [sch_ECOTAG].[T_User] ADD [USR_Role] [varchar](128) NULL;
GO 

/****** Object:  Table [sch_ECOTAG].[T_Group] ******/
ALTER TABLE [sch_ECOTAG].[T_Group] ALTER COLUMN [GRP_CreatorNameIdentifier] [varchar](64) NOT NULL;
GO

/****** Object:  Table [sch_ECOTAG].[T_Dataset] ******/
ALTER TABLE [sch_ECOTAG].[T_Dataset] ALTER COLUMN [DTS_CreatorNameIdentifier] [varchar](64) NOT NULL;
GO

/****** Object:  Table [sch_ECOTAG].[T_File] ******/
ALTER TABLE [sch_ECOTAG].[T_File] ALTER COLUMN [FLE_CreatorNameIdentifier] [varchar](64) NOT NULL;
GO

/****** Object:  Table [sch_ECOTAG].[T_Project] ******/
ALTER TABLE [sch_ECOTAG].[T_Project] ALTER COLUMN [PRJ_CreatorNameIdentifier] [varchar](64) NOT NULL;
GO

/****** Object:  Table [sch_ECOTAG].[T_Annotation] ******/
ALTER TABLE [sch_ECOTAG].[T_Annotation] ALTER COLUMN [ANO_CreatorNameIdentifier] [varchar](64) NOT NULL;
GO
        
/****** Object:  Table [sch_ECOTAG].[T_Audit] ******/
ALTER TABLE [sch_ECOTAG].[T_Audit] ALTER COLUMN [AUD_NameIdentifier] [varchar](64) NOT NULL;
GO