const express = require("express");
const { userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validadtion");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


// I am creating express js application
const app = express();

// It will take json data from the request and convert that data into javascript object and add the javascript object into request object
app.use(express.json());
// when ever any request will come my cookies will parse and we can access that cookies, suppose i am not use the cookeparser middleware wecan get the cookies
app.use(cookieParser());

app.post('/signup', async(req, res)=>{
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

app.post('/login', async(req, res)=>{
     try {
          const {emailId, password} = req.body;
          // validate the data from request body
          validateLoginData(req);

          //I find the user is register or not
          const user = await User.findOne({emailId});
          if(!user){
               throw new Error("Invalid credentials")
          }
          console.log(typeof user.validatePassword); // Should be "function"

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

app.get('/profile', userAuth, async(req, res)=>{
     try {
          const user = req?.userData
          res.send(user)
     } catch (error) {
          res.status(400).send("ERROR:"+error.message)
     }
})

// Get user details based on email
app.get('/user', async(req,res)=>{
     const userEmail = req.body.emailId;
     try {
          const user = await User.findOne({emailId:userEmail});
          if(!user){
               res.status(404).send("User Not found!")
          }else{
               res.send(user)
          }
          // if(users.length === 0){
          //      res.status(404).send("User not found!")
          // }else{
          //      res.send(users);
          // }
     } catch (error) {
          res.status(400).send('Something went wrong')
     }
})

app.post('/sendConnectionRequest', userAuth, async(req, res)=>{
     try {
          const {userData} = req;
          res.send(userData.firstName + " Send the connection request!")
     } catch (error) {
          
     }
})
// Feed API - GET -> /feed  => Get all the Users from the database
app.get('/feed', async(req,res)=>{
     try {
          const allUsers = await User.find();
          res.send(allUsers)
     } catch (error) {
          res.status(400).send("Something went wrong")
     }
})

// Delete a User based in Id
app.delete('/user', async(req, res)=>{
     const userId = req.body.userId;
     try {
          // const user = await User.findByIdAndDelete({_id:userId})
          const user = await User.findByIdAndDelete(userId)
          if(!user){
               res.status(404).send("User not found!")
          }else{
               res.send("User deleted Sucessfully!")
          }
     } catch (error) {
          res.status(400).send("Something went wrong")
     }
})

// Update data of the user
app.patch('/user/:userId', async(req, res)=>{
     const userId = req.params?.userId;
     const emailId = req.body.emailId;
     const data = req.body;
     const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];
//      {
//     "userId":"68629451a5811b4747ecd689",
//     "emailId":"pratyakshaambig@gmail.com",
//     "gender":"male",
//     "skills":["javascript","node.js"]
    
// }
     try {
          // const user = await User.findByIdAndUpdate(userId, data, {returnDocument:"after"});
          // const user = await User.findByIdAndUpdate({_id:userId}, data, {returnDocument:"after"});
          const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
         if(!isUpdateAllowed){
          throw new Error("Updates not allowed!")
         };
         if(data?.skills.length > 10){
          throw new Error("Skills cannot be more than 10")
         }
          const user = await User.findByIdAndUpdate(userId,data, {
               returnDocument:'after',
               runValidators:true
          })

          return res.json({message:"User data Updated", user});
     } catch (error) {
         res.status(400).send("Update Failed :" + error.message) 
     }
})

connectDB().then(() => {
     console.log("Database connection Successfully!")
     app.listen(7777, () => {
          console.log("Server is successfully listening on port 7777")
     })
}).catch((err) => {
     console.error("Database can not be Connected!.")
})

