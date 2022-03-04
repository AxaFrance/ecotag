using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Ml.Cli.WebApp.Server;

public static class DbSetExtension
{
    public static EntityEntry<T> AddIfNotExists<T>(this DbSet<T> dbSet, T entity, Expression<Func<T, bool>> predicate = null)
        where T : class, new()
    {
        var isInDbSet = predicate != null ? dbSet.Any(predicate) : dbSet.Any();
        return !isInDbSet ? dbSet.Add(entity) : null;
    }
}