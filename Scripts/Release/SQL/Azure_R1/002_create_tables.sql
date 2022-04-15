USE [ECOTAG]
GO


/****** Object:  Table [sch_ECOTAG].[T_User] ******/
if not exists (select * from sysobjects where name='T_User' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_User](
    [USR_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [USR_Email] [varchar](254) NOT NULL,
    [USR_NameIdentifier] [varchar](32) NOT NULL,
    CONSTRAINT [PK_T_User] PRIMARY KEY ([USR_Id]),
    CONSTRAINT [PK_T_User_Email] UNIQUE ([USR_Email]),
    CONSTRAINT [PK_T_User_NameIdentifier] UNIQUE ([USR_NameIdentifier])
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

GO 

/****** Object:  Table [sch_ECOTAG].[T_Group] ******/
if not exists (select * from sysobjects where name='T_Group' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Group](
    [GRP_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [GRP_Name] [varchar](48) NOT NULL,
    [GRP_CreatorNameIdentifier] [varchar](32) NOT NULL,
    [GRP_CreateDate] BIGINT NOT NULL,
    [GRP_UpdateDate] BIGINT NOT NULL,
    CONSTRAINT [PK_T_Group] PRIMARY KEY ([GRP_Id]),
    CONSTRAINT [PK_T_Group_Name] UNIQUE ([GRP_Name]),
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

GO

/****** Object:  Table [sch_ECOTAG].[T_GroupUsers] ******/
if not exists (select * from sysobjects where name='T_GroupUsers' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_GroupUsers](
    [GPU_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [GRP_Id] uniqueidentifier NOT NULL,
    [USR_Id] uniqueidentifier NOT NULL
    CONSTRAINT [PK_T_GroupUsers] PRIMARY KEY ([GPU_Id]),
    CONSTRAINT [FK_GRP_Id] FOREIGN KEY (GRP_Id) REFERENCES [sch_ECOTAG].[T_Group] (GRP_Id),
    CONSTRAINT [FK_USR_Id] FOREIGN KEY (USR_Id) REFERENCES [sch_ECOTAG].[T_User] (USR_Id),
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

GO

/****** Object:  Table [sch_ECOTAG].[T_Dataset] ******/
if not exists (select * from sysobjects where name='T_Dataset' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Dataset](
    [DTS_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [DTS_Name] [varchar](48) NOT NULL,
    [DTS_Type] int NOT NULL,
    [DTS_Classification] int NOT NULL,
    [GRP_Id] uniqueidentifier NOT NULL,
    [DTS_CreatorNameIdentifier] [varchar](32) NOT NULL,
    [DTS_CreateDate] BIGINT NOT NULL,
    [DTS_IsLocked] bit NULL,
    CONSTRAINT [PK_T_Dataset] PRIMARY KEY ([DTS_Id]),
    CONSTRAINT [UK_T_Dataset_Name] UNIQUE ([DTS_Name]),
    CONSTRAINT [FK_GRP_Id] FOREIGN KEY (GRP_Id) REFERENCES [sch_ECOTAG].[T_Group] (GRP_Id),
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
    CONSTRAINT [PK_T_File] PRIMARY KEY ([FLE_Id]),
    CONSTRAINT [FK_DTS_Id] FOREIGN KEY (DTS_Id) REFERENCES [sch_ECOTAG].[T_Dataset] (DTS_Id),
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]
END

GO


/****** Object:  Table [sch_ECOTAG].[T_Project] ******/
if not exists (select * from sysobjects where name='T_Project' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Project](
    [PRJ_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [DTS_Id] uniqueidentifier NOT NULL,
    [GRP_Id] uniqueidentifier NOT NULL,
    [PRJ_Name] [varchar](48) NOT NULL,
    [PRJ_NumberCrossAnnotation] [int] NOT NULL CHECK (PRJ_NumberCrossAnnotation between 1 and 10),
    [PRJ_CreateDate] BIGINT NOT NULL,
    [PRJ_AnnotationType] int NOT NULL,
    [PRJ_LabelsJson] [varchar](2048) NOT NULL,
    [PRJ_CreatorNameIdentifier] [varchar](32) NOT NULL,
    CONSTRAINT [PK_T_Project] PRIMARY KEY ([PRJ_Id]),
    CONSTRAINT [FK_GRP_Id] FOREIGN KEY (GRP_Id) REFERENCES [sch_ECOTAG].[T_Group] (GRP_Id),
    CONSTRAINT [FK_DTS_Id] FOREIGN KEY (DTS_Id) REFERENCES [sch_ECOTAG].[T_Dataset] (DTS_Id),
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    )
END

GO

/****** Object:  Table [sch_ECOTAG].[T_Reservation] ******/
if not exists (select * from sysobjects where name='T_Reservation' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Reservation](
    [RSV_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [FLE_Id] uniqueidentifier NOT NULL,
    [PRJ_Id] uniqueidentifier NOT NULL,
    [RSV_TimeStamp] BIGINT NOT NULL,
    CONSTRAINT [PK_T_Reservation] PRIMARY KEY ([RSV_Id]),
    CONSTRAINT [FK_FLE_Id] FOREIGN KEY (FLE_Id) REFERENCES [sch_ECOTAG].[T_File] (FLE_Id),
    CONSTRAINT [FK_PRJ_Id] FOREIGN KEY (PRJ_Id) REFERENCES [sch_ECOTAG].[T_Project] (PRJ_Id),
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    )
END

GO

/****** Object:  Table [sch_ECOTAG].[T_Annotation] ******/
if not exists (select * from sysobjects where name='T_Annotation' and xtype='U')
BEGIN
CREATE TABLE [sch_ECOTAG].[T_Annotation](
    [ANO_Id] uniqueidentifier NOT NULL DEFAULT newid(),
    [FLE_Id] uniqueidentifier NOT NULL,
    [PRJ_Id] uniqueidentifier NOT NULL,
    [ANO_CreatorNameIdentifier] [varchar](32) NOT NULL,
    [ANO_TimeStamp] BIGINT NOT NULL,
    [ANO_ExpectedOutput] [varchar](4048) NOT NULL,
    CONSTRAINT [PK_T_Annotation] PRIMARY KEY ([ANO_Id]),
    CONSTRAINT [FK_FLE_Id] FOREIGN KEY (FLE_Id) REFERENCES [sch_ECOTAG].[T_File] (FLE_Id),
    CONSTRAINT [FK_PRJ_Id] FOREIGN KEY (PRJ_Id) REFERENCES [sch_ECOTAG].[T_Project] (PRJ_Id),
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
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
    CONSTRAINT [PK_T_Audit] PRIMARY KEY ([AUD_Id]),
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    )
END

GO
