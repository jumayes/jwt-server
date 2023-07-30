const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../service/mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dtos');
const ApiError = require('../exceotion/api-errors');

class UserService {
    async regisTration(email,password){
        const canditate = await userModel.findOne({email});

        if (canditate) {
            throw ApiError.BedRequest(`error  bu akkount oldin registrasiya bo'lgan ${email}`)
        };

        const HashPassword = await bcrypt.hash(password , 3);
        const activationLink = uuid.v4();
        const user = await userModel.create({email , password:HashPassword , activationLink});
        await mailService.sendActivationMail(email , `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user)
        const tokens = tokenService.genereteTokens({...userDto});
        await tokenService.saveToken(userDto.id , tokens.refreshToken);

        return{...tokens , user : userDto}

    }

    async activate(activationLink){
        const user = await userModel.findOne({activationLink});
        if (!user){
            throw ApiError.BedRequest('error activation')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email,password){
        const user = await userModel.findOne({email});
        if(!user){
          throw ApiError.BedRequest('User with this email not found')
        }
        const isPassEquals = await bcrypt.compare(password , user.password);
        if (!isPassEquals){
            throw ApiError.BedRequest('no valid password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.genereteTokens({...userDto});

        await tokenService.saveToken(userDto.id , tokens.refreshToken);

        return{...tokens , user : userDto}
      }

      async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token ;
      }

      async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError();
        }
        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.genereteTokens({...userDto});

        await tokenService.saveToken(userDto.id , tokens.refreshToken);

        return{...tokens , user : userDto}

      }

      async getAllUsers(){
        const users = await userModel.find();
        return users;
      }

}

module.exports = new UserService();