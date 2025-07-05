const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required:true,
        // If i write unique is true then no need to add the index and moongose is automatically create in index
        // Using Index we can optimize the query -> Like if there are 1000 users in our app, i have find perticular user using this email in our platform, i want to use the index or unique true using this index or unique we can optimize the query
        // index:true
        unique:true,
        lowercase:true,
        trim:true,
        validate (value){
            if(!validator.isEmail(value)){
                throw new Error("Inavalid email id:" + value)
            }
        }
    },
    password: {
        type: String,
        required:true,
        validate (value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter the String password" + value)
            }
        }
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        // enum:{
        //     values:['male', 'female','others'],
        //     message:`{VALUE} is not a valid gender type`
        // },
        // or below validate are custom validation and are enum validadtion
        // This validate function will only be called when new user is created or new document is created, it will not call in the update time like put and patch
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://smsdelhibmw.co.in/wp-content/uploads/2022/02/User-Profile-PNG.png",
        validate (value){
            if(!validator.isURL(value)){
                throw new Error("Inavalid Photo URL" + value)
            }
        }
    },
    about:{
        type:String,
        default:"This is the default about of the user!"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})


// This is the schema method - reason of creating the this method is , this will specific to the this userschema , like generate token for the user, and validate the password in the user schema, it is very easy to debug
userSchema.methods.getJWT = async function(){
    // I'm refering to the user instance and this keyword will work only for the normal function
    const user = this
    const token = await jwt.sign({_id:user._id}, 'PVAmbig@1015',{expiresIn:'1d'});
    return token
} 

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const hashedPassword = user?.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashedPassword);
    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);

module.exports=User;