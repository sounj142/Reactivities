migration:
dotnet ef migrations add InitialDatabase -p Persistence -s API
dotnet ef database update UserFollowingAdded -p Persistence -s API
