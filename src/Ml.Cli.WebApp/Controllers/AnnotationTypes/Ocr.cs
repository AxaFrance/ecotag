namespace Ml.Cli.WebApp.Controllers.AnnotationTypes
{
    public class OcrLabels
    {
        public string Recto { get; set; }
        public string Verso { get; set; }

        public OcrLabels(string recto, string verso)
        {
            Recto = recto;
            Verso = verso;
        }
    }

    public class Ocr
    {
        public string Type { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public OcrLabels Labels { get; set; }

        public Ocr(string type, int width, int height, OcrLabels labels)
        {
            Type = type;
            Width = width;
            Height = height;
            Labels = labels;
        }
    }
}