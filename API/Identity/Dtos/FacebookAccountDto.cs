namespace API.Identity.Dtos;

public class FacebookAccountDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public PictureWrapperDto Picture { get; set; }

    public class PictureWrapperDto
    {
        public PictureDto Data { get; set; }
    }
    public class PictureDto
    {
        public string Url { get; set; }
    }
}



