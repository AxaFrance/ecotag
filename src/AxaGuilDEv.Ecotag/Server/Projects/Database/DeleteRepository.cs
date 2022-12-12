using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public class DeleteRepository : IDeleteRepository
{
    private readonly DatasetContext _datasetContext;
    private readonly IFileService _fileService;
    private readonly ProjectContext _projectContext;

    public DeleteRepository(DatasetContext datasetContext, ProjectContext projectContext, IFileService fileService)
    {
        _datasetContext = datasetContext;
        _projectContext = projectContext;
        _fileService = fileService;
    }

    public async Task DeleteProjectWithDatasetAsync(GetDatasetInfo dataset, string projectId)
    {
        await DeleteAnnotationsByProjectIdAsync(projectId);
        await DeleteReservationsByProjectIdAsync(projectId);
        await DeleteProjectAsync(projectId);
        var isDatasetUsedByOtherProjects = IsDatasetUsedByOtherProjects(projectId, dataset.Id);
        if (!isDatasetUsedByOtherProjects)
        {
            await DeleteFilesAsync(dataset.Id);
            await DeleteDatasetAsync(dataset.Id);
        }

        await _projectContext.SaveChangesAsync();
        await _datasetContext.SaveChangesAsync();
    }

    private bool IsDatasetUsedByOtherProjects(string projectId, string datasetId)
    {
        return _projectContext.Projects.AsNoTracking().Any(project =>
            project.Id != new Guid(projectId) && project.DatasetId == new Guid(datasetId));
    }

    private async Task DeleteAnnotationsByProjectIdAsync(string projectId)
    {
        var annotations = await _datasetContext.Annotations
            .Where(annotation => annotation.ProjectId == new Guid(projectId)).ToListAsync();
        foreach (var annotation in annotations) _datasetContext.Annotations.Remove(annotation);
    }

    private async Task DeleteReservationsByProjectIdAsync(string projectId)
    {
        var reservations = await _datasetContext.Reservations
            .Where(reservation => reservation.ProjectId == new Guid(projectId)).ToListAsync();
        foreach (var reservation in reservations) _datasetContext.Reservations.Remove(reservation);
    }

    private async Task DeleteProjectAsync(string projectId)
    {
        var project = await _projectContext.Projects
            .FirstOrDefaultAsync(project => project.Id == new Guid(projectId));
        if (project == null) return;

        _projectContext.Projects.Remove(project);
    }

    private async Task DeleteDatasetAsync(string datasetId)
    {
        var dataset = await _datasetContext.Datasets
            .FirstOrDefaultAsync(dataset => dataset.Id == new Guid(datasetId));

        if (dataset != null) _datasetContext.Datasets.Remove(dataset);
    }

    private async Task DeleteFilesAsync(string datasetId)
    {
        var files = await _datasetContext.Files.Where(file => new Guid(datasetId) == file.DatasetId).ToListAsync();
        if (files.Count > 0) _datasetContext.Files.RemoveRange(files);

        var blobUri = await _datasetContext.Datasets.Where(d => d.Id == Guid.Parse(datasetId)).Select(d => d.BlobUri)
            .FirstOrDefaultAsync();
        if (!string.IsNullOrEmpty(blobUri)) await _fileService.DeleteDirectoryAsync(blobUri);
    }
}