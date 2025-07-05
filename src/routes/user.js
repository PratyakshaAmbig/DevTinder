const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl, age, skills'

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

module.exports=userRouter