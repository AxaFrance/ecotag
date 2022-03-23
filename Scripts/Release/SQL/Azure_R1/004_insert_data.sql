USE [ECOTAG]
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