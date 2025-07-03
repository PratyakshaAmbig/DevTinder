const validator = require("validator");

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailId, password} = req?.body
    if(!firstName || !lastName || !emailId || !password){
        throw new Error("All fiels are required")
    }else if(firstName.length < 4 || firstName >50){
        throw new Error("First name is 4-50 character.")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter string password")
    }
}

const validateLoginData = (req)=>{
    const {emailId, password} = req.body;
    if(!emailId || !password){ 
        throw new Error("Email Id and password is requiered!")
    }
}

module.exports={
    validateSignUpData,
    validateLoginData
}