const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");


// I am creating express js application
const app = express();

app.use(cors({
     //Where your frontend hosted or we have whitlisted the frontend domains
     origin:'http://localhost:5173',
     credentials:true
}))
// It will take json data from the request and convert that data into javascript object and add the javascript object into request object
app.use(express.json());
// when ever any request will come my cookies will parse and we can access that cookies, suppose i am not use the cookeparser middleware wecan get the cookies
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter)
app.use('/', userRouter)

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

