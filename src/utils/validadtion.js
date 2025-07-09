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

const validaEditProfileData = (req)=>{
    const allowedEditFields = ['firstName','lastName','age','gender','about','photoUrl','skills']
   
    // console.log(Object.keys(req.body));
    const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field))
    if(isEditAllowed){
        if(!validator.isURL(req?.body?.photoUrl)){
            throw new Error('Invalid photo Url')
        }else if(req?.body?.skills?.length > 10){
            throw new Error('Skills cannot be more than 10')
        }else if(!req?.body?.age > 18){
            throw new Error('Age sholud be 18 years')
        }
    }
    if (isEditAllowed) return true
    else return false;
}

module.exports={
    validateSignUpData,
    validateLoginData,
    validaEditProfileData
}