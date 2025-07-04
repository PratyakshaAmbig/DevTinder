const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.userAuth = async(req, res, next)=>{
     try {
          // Read the token from the cookies
          const {token} = req?.cookies;
          if(!token){
               throw new Error("Token is required!")
          }
          // Decode the token 
          const decodedToken = await jwt.verify(token, 'PVAmbig@1015');
          const {_id} = decodedToken
          if(!_id){
               throw new Error("Invalid token!")
          }
          // Find the user
          const user = await User.findById(_id);
          if(!user){
               throw new Error("User not found please Register")
          }
          // once i get the uset from db then i have assign that user details in next request handler
          req.userData = user;
          // I have to call the next handler function
          next();
     } catch (error) {
          res.status(400).send("ERROR:" + error.message)
     }
}