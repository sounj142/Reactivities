using AutoMapper;
using Domain;
using Domain.Activities;
using Domain.Photos;
using Persistence.Daos;

namespace Persistence.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, ActivityDao>()
            .ReverseMap();
        CreateMap<ActivityAttendee, ActivityAttendeeDao>()
            .ReverseMap();
        CreateMap<ActivityDao, ActivityWithAttendees>();
        CreateMap<ActivityAttendeeDao, Attendee>()
            .ForMember(x => x.Email, x => x.MapFrom(q => q.User.Email))
            .ForMember(x => x.UserName, x => x.MapFrom(q => q.User.UserName))
            .ForMember(x => x.DisplayName, x => x.MapFrom(q => q.User.DisplayName))
            .ForMember(x => x.Bio, x => x.MapFrom(q => q.User.Bio))
            .ForMember(x => x.Image, g =>
                g.MapFrom(q => q.User.Photos.FirstOrDefault(p => p.IsMain).Url));
        CreateMap<Photo, PhotoDao>()
            .ReverseMap();
        CreateMap<AppUserDao, UserProfile>();
        CreateMap<AppUserDao, UserProfileFullInfo>()
            .ForMember(x => x.Image, g =>
                g.MapFrom(q => q.Photos.FirstOrDefault(p => p.IsMain).Url));
    }
}