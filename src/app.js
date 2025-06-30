const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");

// I am creating express js application
const app = express();

// It will take json data from the request and convert that data into javascript object and add the javascript object into request object
app.use(express.json());

app.post('/signup', async(req, res)=>{
     try {
     // Creating the new Instance of User Model
     const user = new User(req.body)
     const data = await user.save();
     res.send("User added Successfully.")
     } catch (error) {
          res.status(400).send("Error Saving the user" + error.message)
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
app.patch('/user', async(req, res)=>{
     const userId = req.body.userId;
     const emailId = req.body.emailId;
     const data = req.body;
     try {
          // const user = await User.findByIdAndUpdate(userId, data, {returnDocument:"after"});
          // const user = await User.findByIdAndUpdate({_id:userId}, data, {returnDocument:"after"});
          const user = await User.findOneAndUpdate({emailId},data, {
               returnDocument:'after',
               runValidators:true
          })

          return res.json({message:"User data Updated", user});
     } catch (error) {
         res.status(400).send("Something went wrong" + error.message) 
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

