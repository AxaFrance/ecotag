namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;

public record AnnotationNer
{
    public int Start { get; set; }
    public int End { get; set; }
    public string Token { get; set; }
    public AnnotationNerLabel Label { get; set; }
}

public record AnnotationNerLabel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Color { get; set; }
}