using Application.Activities.Dtos;
using Application.Comments.Dtos;
using AutoMapper;
using Domain.Activities;
using Domain.Comments;

namespace Application.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, ActivityDto>()
            .ReverseMap();

        CreateMap<CommentDto, Comment>();
    }
}