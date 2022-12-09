using Application.Activities.Dtos;
using AutoMapper;
using Domain.Activities;

namespace Application.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, ActivityDto>()
            .ReverseMap();
    }
}