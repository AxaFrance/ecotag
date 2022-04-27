using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public class DeleteRepository
{
    public const string DeletionFailed = "DeletionFailed";
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

    private async Task DeleteFileAsync(string datasetId, string fileId)
    {
        var file = await _deleteContext.Files.FirstOrDefaultAsync(file =>
            file.Id == new Guid(fileId) && file.DatasetId == new Guid(datasetId));

        if (file != null)
        {
            _deleteContext.Files.Remove(file);
        }
    }

    private async Task DeleteFilesAsync(string datasetId, IList<string> filesIds)
    {
        foreach (var fileId in filesIds)
        {
            await DeleteFileAsync(datasetId, fileId);
        }

        await _fileService.DeleteContainerAsync(datasetId);
    }

    public async Task<ResultWithError<bool, ErrorResult>> DeleteProjectWithDatasetAsync(GetDataset dataset, string projectId)
    {
        var commandResult = new ResultWithError<bool, ErrorResult>();
        
        try
        {
            await DeleteAnnotationsByProjectIdAsync(projectId);
            await DeleteReservationsByProjectIdAsync(projectId);
            await DeleteProjectAsync(projectId);
            var isDatasetUsedByOtherProjects = IsDatasetUsedByOtherProjects(projectId, dataset.Id);
            if (!isDatasetUsedByOtherProjects)
            {
                var filesIds = dataset.Files.Select(file => file.Id.ToString()).ToList();
                await DeleteFilesAsync(dataset.Id, filesIds);
                await DeleteDatasetAsync(dataset.Id);
            }

            await _deleteContext.SaveChangesAsync();
        }
        catch (Exception)
        {
            commandResult.Error = new ErrorResult
            {
                Key = DeletionFailed
            };
            return commandResult;
        }

        commandResult.Data = true;
        return commandResult;
    }
}