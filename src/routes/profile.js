const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async(req, res)=>{
     try {
          const user = req?.userData
          res.send(user)
     } catch (error) {
          res.status(400).send("ERROR:"+error.message)
     }
})

module.exports=profileRouter;