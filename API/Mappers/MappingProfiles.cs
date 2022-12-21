using API.Identity.Dtos;
using AutoMapper;
using Persistence.Daos;

namespace API.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<AppUserDao, UserDto>()
            .ForMember(x => x.Image, x =>
                x.MapFrom(q => q.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(x => x.isEmptyCredential, x =>
                x.MapFrom(q => q.PasswordHash == null));
        CreateMap<PhotoDao, PhotoDto>();
        CreateMap<RegisterDto, AppUserDao>();
    }
}