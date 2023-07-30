const ApiEror = require("../exceotion/api-errors")
const tokenService = require('../service/token-service')

module.exports = function(req ,res , next) {
    try{
        const authorizatiionHeader = req.headers.authorization;
        if(!authorizatiionHeader){
            return next(ApiEror.UnauthorizedError());
        }

        const accessToken = authorizatiionHeader.split('')[1];

        if(!accessToken){
            return next(ApiEror.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            return next(ApiEror.UnauthorizedError());
        }
    
        req.user = userData;
        next();
    }catch(e){
        return next(ApiEror.UnauthorizedError());
    }
}