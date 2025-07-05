const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post('/request/sent/:status/:toUserId', userAuth, async(req, res)=>{
     try {
          const fromUserId = req.userData._id;
          const {status,toUserId} = req.params;

          const allowedStatus = ['ignored', 'interested']
          if(!allowedStatus.includes(status)){
               return res.status(400).json({message: 'Inavalid status type: '+status})
          }

          const toUser = await User.findById(toUserId);
          if(!toUser){
               return res.status(404).json({
                    message:"User not found!"
               })
          }
          // In this step i have to check the connection is already present or not
          const existingConnectionRequest = await ConnectionRequest.findOne({
               $or:[
                    {fromUserId,toUserId},
                    {fromUserId:toUserId, toUserId:fromUserId}
               ]
          });

          if(existingConnectionRequest){
               return res.status(400).json({
                    message:'Connnection request is already sent!'
               })
          }
          
          const connectionRequest =  new ConnectionRequest({
               fromUserId,
               toUserId,
               status
          })
          const data = await connectionRequest.save();
          res.json({
               message:req.userData?.firstName + " is " + status + " in " + toUser.firstName + "",
               data
          })
     } catch (error) {
          res.status(400).send("ERROR:" + error.message)
     }
})

module.exports=requestRouter