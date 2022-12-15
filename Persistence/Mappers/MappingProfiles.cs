using AutoMapper;
using Domain.Activities;
using Domain.Comments;
using Domain.Followers;
using Domain.Photos;
using Domain.Profiles;
using Persistence.Daos;

namespace Persistence.Mappers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        string currentUserId = null;
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
        CreateMap<ActivityAttendeeDao, AttendeeWithFollowInfo>()
            .ForMember(x => x.Email, x => x.MapFrom(q => q.User.Email))
            .ForMember(x => x.UserName, x => x.MapFrom(q => q.User.UserName))
            .ForMember(x => x.DisplayName, x => x.MapFrom(q => q.User.DisplayName))
            .ForMember(x => x.Bio, x => x.MapFrom(q => q.User.Bio))
            .ForMember(x => x.Image, g =>
                g.MapFrom(q => q.User.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(x => x.FolowersCount, g => g.MapFrom(q => q.User.Followers.Count()))
            .ForMember(x => x.FolowingsCount, g => g.MapFrom(q => q.User.Followings.Count()))
            .ForMember(x => x.CurrentUserFollowing, g => g.MapFrom(
                q => q.User.Followers.Any(x => x.ObserverId == currentUserId)));

        CreateMap<Photo, PhotoDao>()
            .ReverseMap();
        CreateMap<AppUserDao, UserProfile>();
        CreateMap<AppUserDao, UserProfileFullInfo>()
            .ForMember(x => x.Image, g =>
                g.MapFrom(q => q.Photos.FirstOrDefault(p => p.IsMain).Url));

        CreateMap<UserFollowingDao, UserFollower>()
            .ForMember(x => x.Id, g => g.MapFrom(q => q.Observer.Id))
            .ForMember(x => x.DisplayName, g => g.MapFrom(q => q.Observer.DisplayName))
            .ForMember(x => x.UserName, g => g.MapFrom(q => q.Observer.UserName))
            .ForMember(x => x.Bio, g => g.MapFrom(q => q.Observer.Bio))
            .ForMember(x => x.Image, g => g.MapFrom(
                q => q.Observer.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(x => x.FolowersCount, g => g.MapFrom(q => q.Observer.Followers.Count()))
            .ForMember(x => x.FolowingsCount, g => g.MapFrom(q => q.Observer.Followings.Count()))
            .ForMember(x => x.CurrentUserFollowing, g => g.MapFrom(
                q => q.Observer.Followers.Any(x => x.ObserverId == currentUserId)));
        CreateMap<UserFollowingDao, UserFollowing>()
            .ForMember(x => x.Id, g => g.MapFrom(q => q.Target.Id))
            .ForMember(x => x.DisplayName, g => g.MapFrom(q => q.Target.DisplayName))
            .ForMember(x => x.UserName, g => g.MapFrom(q => q.Target.UserName))
            .ForMember(x => x.Bio, g => g.MapFrom(q => q.Target.Bio))
            .ForMember(x => x.Image, g => g.MapFrom(
                q => q.Target.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(x => x.FolowersCount, g => g.MapFrom(q => q.Target.Followers.Count()))
            .ForMember(x => x.FolowingsCount, g => g.MapFrom(q => q.Target.Followings.Count()))
            .ForMember(x => x.CurrentUserFollowing, g => g.MapFrom(
                q => q.Target.Followers.Any(x => x.ObserverId == currentUserId)));

        CreateMap<AppUserDao, UserFollower>()
            .ForMember(x => x.Image, g => g.MapFrom(
                q => q.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(x => x.FolowersCount, g => g.MapFrom(q => q.Followers.Count()))
            .ForMember(x => x.FolowingsCount, g => g.MapFrom(q => q.Followings.Count()))
            .ForMember(x => x.CurrentUserFollowing, g => g.MapFrom(
                q => q.Followers.Any(x => x.ObserverId == currentUserId)));

        CreateMap<Comment, CommentDao>()
            .ReverseMap();
        CreateMap<CommentDao, CommentWithAuthor>()
            .ForMember(x => x.AuthorUserName, g => g.MapFrom(q => q.Author.UserName))
            .ForMember(x => x.AuthorDisplayName, g => g.MapFrom(q => q.Author.DisplayName))
            .ForMember(x => x.AuthorImage, g => g.MapFrom(q => q.Author.Photos.FirstOrDefault(p => p.IsMain).Url));

        CreateMap<ActivityDao, ActivityMinimumInfo>();
    }
}