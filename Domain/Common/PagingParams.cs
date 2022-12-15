namespace Domain.Common;

public class PagingParams
{
    const int MIN_PAGE_SIZE = 2;
    const int MAX_PAGE_SIZE = 50;

    private int _pageSize = 10;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MAX_PAGE_SIZE)
            ? MAX_PAGE_SIZE
            : (value < MIN_PAGE_SIZE ? MIN_PAGE_SIZE : value);
    }

    private int _currentPage = 1;
    public int CurrentPage
    {
        get => _currentPage;
        set => _currentPage = (value < 1) ? 1 : value;
    }
}