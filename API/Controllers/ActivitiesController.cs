using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    private readonly Persistence.DataContext _context;

    public ActivitiesController(ILogger<ActivitiesController> logger,
        Persistence.DataContext context)
        : base(logger)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IList<Domain.Activity>> Get()
    {
        return await _context.Activities.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<Domain.Activity> Get(Guid id)
    {
        return await _context.Activities.FindAsync(id);
    }
}
