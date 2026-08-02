using AutoMapper;
using Resturant_Backend.DTO;

namespace Resturant_Backend.Mapper
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<UserCreatedModel, ResponseRegister>().ReverseMap();
            CreateMap<UserCreatedModel, ResponseLogin>().ReverseMap();
        }

    }
}
