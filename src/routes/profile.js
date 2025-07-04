const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validaEditProfileData } = require("../utils/validadtion");
const profileRouter = express.Router();

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

module.exports=profileRouter;