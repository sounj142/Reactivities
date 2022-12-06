using API.Identity.Dtos;
using AutoMapper;
using Persistence.Daos;

namespace API.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<AppUserDao, UserDto>();
        CreateMap<RegisterDto, AppUserDao>();
    }
}