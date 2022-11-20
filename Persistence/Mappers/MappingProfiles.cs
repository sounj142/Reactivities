using AutoMapper;
using Domain;
using Persistence.Daos;

namespace Persistence.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, ActivityDao>()
            .ReverseMap();
    }
}