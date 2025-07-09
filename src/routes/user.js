const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age skills'

// Get all the pending request data from the perticular loggedInUser
userRouter.get('/user/requests/received', userAuth, async(req, res)=>{
    try {
        const loggedInUserId = req.userData;
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUserId._id,
            status:'interested'
        }).populate("fromUserId", USER_SAFE_DATA)
        // or
        // }).populate("fromUserId", ['firstName', 'lastName'])
        // populate("fromUserId") -> if i am not passing the second argument , it will retrun all the data of the user , it is bad , we must pass the second argument , it means what are the data is needed for the user

        res.json({
            message:"Data fetch successfully!",
            data: connectionRequests
        })
    } catch (error) {
        res.status(400).send("ERROR : "+error.message)
    }
})

userRouter.get('/user/connection', userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.userData;

        const connetedUsersData = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id, status:'accepted'},
                {toUserId:loggedInUser._id, status:'accepted'}
            ]
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA)

        const data = connetedUsersData.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({data})
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
})

userRouter.get('/feed', userAuth, async(req,res)=>{
    try {
        // Query comming the string format and i have to convert into the string format
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        // using below condition we can requse the number of limits like suppose user can access 1000 of document, but we can restict user can it at a time 10 document
        limit = limit >10 ? 10 : limit
        const skipDocument = (page - 1)* limit
        const loggedInUser = req.userData;

        // Find all the connection request (sent + receive);
        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id}, {toUserId:loggedInUser._id}]
        }).select('fromUserId toUserId status').populate('fromUserId', 'firstName').populate('toUserId','firstName');

        // Hide the user from the feed like user is already sent the connection to another user
        // Set -> it store the unique element 
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId._id.toString())
            hideUserFromFeed.add(req.toUserId._id.toString())
        })
        console.log(hideUserFromFeed);

        const users = await User.find({
            $and:[
                // First convert the set in to array and we have to find what are values is present in the set that are not prsent in the id
                {_id:{$nin:Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skipDocument).limit(limit)
        res.json({
            data:users
        })
    } catch (error) {
        res.status(400).json({message : + error.message})
    }
})

module.exports=userRouter