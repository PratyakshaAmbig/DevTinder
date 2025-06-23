const express = require("express");

// I am creating express js application
const app = express();

// This funcion is know as Requset handler



app.use("/hello", (req, res)=>{
    res.send("Hello Hello....")
})

app.use('/test',(req, res)=>{
    res.send("Hello from the tester")
})

app.use('/', (req, res)=>{
    res.send("Hello Pratyaksha!")
})

app.listen(7777, ()=>{
    console.log("Server is successfully listening on port 7777")
})