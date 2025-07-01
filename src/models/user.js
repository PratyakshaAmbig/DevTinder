const mongoose = require("mongoose");
const validator = require("validator");

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

const User = mongoose.model('User', userSchema);

module.exports=User;