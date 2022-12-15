using Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Utils;

public static class Helpers
{
    public static async Task<PagedList<T>> CreatePageList<T>(IQueryable<T> queryable, int currentPage, int pageSize)
    {
        var totalCount = await queryable.CountAsync();
        var data = await queryable.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedList<T>(data, currentPage, pageSize, totalCount);
    }
}