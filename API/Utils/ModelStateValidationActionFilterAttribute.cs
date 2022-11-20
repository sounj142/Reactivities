using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Utils;

public class ModelStateValidationActionFilterAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var modelState = context.ModelState;
        if (!modelState.IsValid)
            throw new ValidationException(modelState);
        base.OnActionExecuting(context);
    }
}
