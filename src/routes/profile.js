const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validaEditProfileData } = require("../utils/validadtion");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

profileRouter.get('/profile/view', userAuth, async(req, res)=>{
     try {
          const user = req?.userData
          res.send(user)
     } catch (error) {
          res.status(400).send("ERROR:"+error.message)
     }
})

profileRouter.patch('/profile/edit', userAuth, async(req, res)=>{
    try {
        if(!validaEditProfileData(req)){
            throw new Error("Invalid edit request!")
        }

        const logedInUserData = req?.userData;
        console.log("Before Updating the Loginuserdata:",logedInUserData)

        // In this step I have attached the request body data to the login user and later this data we have to send to the database or we can directly update data in the database logic
        Object.keys(req.body).every((keys)=>logedInUserData[keys] = req.body?.[keys]);
        console.log('After update the login userData:',logedInUserData)

        await logedInUserData.save();
        res.json({
            message:`${logedInUserData.firstName} Your profile updated Successfully`,
            data:logedInUserData
        })
    } catch (error) {
        res.status(400).send('ERROR:'+ error.message)
    }
})

profileRouter.patch('/updatePassword', userAuth, async(req,res)=>{
    try {
        const {_id} = req?.userData;
        const {password,newPassword} = req.body;
        const findUser = await User.findById(_id);

        const isPasswordCorrect = await findUser.validatePassword(password);
        if(!isPasswordCorrect){
            throw new Error("Invalid password")
        }
        if(!password || !newPassword){
            throw new Error("Password is required!")
        }else if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please enter the strong pasword!")
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        const changePassword = await User.findByIdAndUpdate(_id,{password:hashedPassword});
        if(changePassword){
            res.send("Password Updated Successfully!")
        }

    } catch (error) {
        res.status(400).send("ERROR:"+ error.message)
    }
})

module.exports=profileRouter;