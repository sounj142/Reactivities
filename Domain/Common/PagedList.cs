namespace Domain.Common;

public class PagedList<T>
{
    public int CurrentPage { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public int TotalPages { get; }
    public IList<T> Data { get; }

    public bool HasPreviousPage => CurrentPage > 1;
    public bool HasNextPage => CurrentPage < TotalPages;

    public PagedList(IList<T> currentPageData, int currentPage, int pageSize, int totalCount)
    {
        Data = currentPageData;
        CurrentPage = currentPage;
        PageSize = pageSize;
        TotalCount = totalCount;

        TotalPages = TotalCount / PageSize;
        if (TotalCount % PageSize > 0) TotalPages++;
    }
}