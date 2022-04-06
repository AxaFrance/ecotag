USE [ECOTAG]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_User]'))
DROP table [sch_ECOTAG].[T_User]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_Group]'))
DROP table [sch_ECOTAG].[T_Group]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_GroupUsers]'))
DROP table [sch_ECOTAG].[T_GroupUsers]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_Dataset]'))
DROP table [sch_ECOTAG].[T_Dataset]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_File]'))
DROP table [sch_ECOTAG].[T_File]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_Project]'))
DROP table [sch_ECOTAG].[T_Project]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_Reservation]'))
DROP table [sch_ECOTAG].[T_Reservation]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_Annotation]'))
DROP table [sch_ECOTAG].[T_Annotation]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_Audit]'))
DROP table [sch_ECOTAG].[T_Audit]
GO
