const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

// I am creating express js application
const app = express();

app.get('/getUserData',(req, res)=>{
     try {
       throw new Error("dcgdghcjs");
       res.send("User data sent successfully...")
     } catch (error) {
          res.status(500).send('Some thing went wrong please contact your team')
     }
})

// Handle Auth Middleware for all request GET, POST, DELETE, PATCH, PUT
app.use('/admin', adminAuth)

app.get('/user',userAuth, (req, res)=>{
     res.send('User data sent.')
})

app.get('/admin/getAllData',(req, res)=>{
     res.send("All data sent")
})

app.get('/admin/deleteData', (req, res)=>{
     res.send("Data is deleted..")
})

// We have to handle the error gracfully for all the routes
app.use('/', (err,req,res,next)=>{
     if(err){
          console.log(err)
          res.status(500).send("Something went wrong...")
     }else{
          next();
     }
})

app.listen(7777, ()=>{
    console.log("Server is successfully listening on port 7777")
})