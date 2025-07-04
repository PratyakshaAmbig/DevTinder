const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', userAuth, async(req, res)=>{
     try {
          const {userData} = req;
          res.send(userData.firstName + " Send the connection request!")
     } catch (error) {
          
     }
})

module.exports=requestRouter