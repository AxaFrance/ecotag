USE [ECOTAG]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_User]'))
DROP table [sch_ECOTAG].[T_User]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_Group]'))
DROP table [sch_ECOTAG].[T_Group]
GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[sch_ECOTAG].[T_GroupUsers]'))
DROP table [sch_ECOTAG].[T_GAINCONTRACT]
GO
