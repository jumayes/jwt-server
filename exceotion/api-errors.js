module.exports = class ApiEror extends Error{
    status;
    errors;

    constructor(status , message, errors =[]){
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(){
        return new ApiEror (401, "User is not authorized")
    }

    static BedRequest(message , errors=[]){
        return new ApiEror(400 , message , errors)
    }

}