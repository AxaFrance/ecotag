public record CreateDataset
{
    public string Name { get; set; }
    
    public string Type { get; set; }
    
    public string Classification { get; set; }
    
    public string GroupId { get; set; }
    
    public string CreatorNameIdentifier { get; set; }
}