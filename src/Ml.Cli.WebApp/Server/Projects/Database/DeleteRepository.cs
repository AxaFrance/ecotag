using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public class DeleteRepository
{
    private readonly DeleteContext _deleteContext;
    private readonly IFileService _fileService;

    public DeleteRepository(DeleteContext deleteContext, IFileService fileService)
    {
        _deleteContext = deleteContext;
        _fileService = fileService;
    }

    private bool IsDatasetUsedByOtherProjects(string projectId, string datasetId)
    {
        return _deleteContext.Projects.AsNoTracking().Any(project =>
            project.Id != new Guid(projectId) && project.DatasetId == new Guid(datasetId));
    }

    private async Task DeleteAnnotationsByProjectIdAsync(string projectId)
    {
        var annotations = await _deleteContext.Annotations
            .Where(annotation => annotation.ProjectId == new Guid(projectId)).ToListAsync();
        foreach (var annotation in annotations)
        {
            _deleteContext.Annotations.Remove(annotation);
        }
    }

    private async Task DeleteReservationsByProjectIdAsync(string projectId)
    {
        var reservations = await _deleteContext.Reservations
            .Where(reservation => reservation.ProjectId == new Guid(projectId)).ToListAsync();
        foreach (var reservation in reservations)
        {
            _deleteContext.Reservations.Remove(reservation);
        }
    }

    private async Task DeleteProjectAsync(string projectId)
    {
        var project = await _deleteContext.Projects
            .FirstOrDefaultAsync(project => project.Id == new Guid(projectId));
        if (project == null)
        {
            return;
        }

        _deleteContext.Projects.Remove(project);
    }

    private async Task DeleteDatasetAsync(string datasetId)
    {
        var dataset = await _deleteContext.Datasets
            .FirstOrDefaultAsync(dataset => dataset.Id == new Guid(datasetId));

        if (dataset != null) _deleteContext.Datasets.Remove(dataset);
    }

    private async Task DeleteFilesAsync(string datasetId)
    {
        var files = await _deleteContext.Files.Where(file => new Guid(datasetId) == file.DatasetId).ToListAsync();
        _deleteContext.Files.RemoveRange(files);
        var blobUri = await _deleteContext.Datasets.Where(d => d.Id == Guid.Parse(datasetId)).Select(d => d.BlobUri).FirstAsync();
        await _fileService.DeleteDirectoryAsync(blobUri);
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

        await _deleteContext.SaveChangesAsync();
    }
}