const express = require("express");
const User = require("../models/user");
const { validateLoginData, validateSignUpData } = require("../utils/validadtion");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post('/signup', async(req, res)=>{
     try {
     // validate the request body data
     validateSignUpData(req)
     
     const {firstName, lastName, emailId, password} = req.body
     // Encrypt the password
     const hashedPassword = await bcrypt.hash(password, 10);
     
     // Creating the new Instance of User Model
     const user = new User({
          firstName,
          lastName,
          emailId,
          password:hashedPassword
     })
     const data = await user.save();
     res.send("User added Successfully.")
     } catch (error) {
          res.status(400).send("ERROR:" + error.message)
     }
})

authRouter.post('/login', async(req, res)=>{
     try {
          const {emailId, password} = req.body;
          // validate the data from request body
          validateLoginData(req);

          //I find the user is register or not
          const user = await User.findOne({emailId});
          if(!user){
               throw new Error("Invalid credentials")
          }

          const isPasswordCorrect = await user.validatePassword(password);
          if(!isPasswordCorrect){
               throw new Error("Invalid credentials")
          }else{
               // Create Jwt Token
               const token = await user.getJWT();
               // Add the token to cookie and send the response to the user
               res.cookie('token',token, {expires: new Date(Date.now() + 8 * 3600000)})
               res.send("Login Successfully!")
          }
     } catch (error) {
          res.status(400).send("ERROR:"+ error.message)
     }
})

module.exports= authRouter