using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AxaGuilDEv.Ecotag.Server.Projects.Database;

public record LabelDataModel
{
    public string Name { get; set; }
    public string Color { get; set; }
    public string Id { get; set; }
}

public class ListLabelDataModel : List<LabelDataModel>;

[JsonSerializable(typeof(ListLabelDataModel))]
[JsonSourceGenerationOptions(WriteIndented = false, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull)]
public partial class ListLabelDataModelSerializerContext : JsonSerializerContext;
