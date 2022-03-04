namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public static class Converter
{
    public static ProjectDataModel ToProjectDataModel(this ProjectModel projectModel)
    {
        return new ProjectDataModel
        {
            Id = projectModel.Id.ToString(),
            Classification = projectModel.Classification,
            Labels = projectModel.Labels,
            Name = projectModel.Name,
            Text = projectModel.Text,
            AnnotationType = projectModel.AnnotationType,
            CreateDate = projectModel.CreateDate,
            NumberTagsToDo = projectModel.NumberTagsToDo
        };
    }
}