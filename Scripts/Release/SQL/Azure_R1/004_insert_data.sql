USE [ECOTAG]
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