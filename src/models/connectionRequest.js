const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', //This will refering to the User collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        required:true,
        // What enum is:when ever i create some filed i want restict that filed in some values it means defined value only accepted for this fileds
        enum:{
            values : ['ignored','interested','accepted','rejected'],
            message :`{VALUE} is incorrect status type`
        }
    }
},{
    timestamps:true
});

// This is compound index
// Job of index is - make our Query fast
// I have write the compound index because inside the query i have to serach to fileds like frmUserId and to UserId
// Suppose i find query using one filed then also i want to  use the compound index , or i have to use normal index is true
// 1 is asending order and -1 is desending order
connectionRequestSchema.index({fromUserId:1, toUserId:1})

//This is kind of a middleware it will be called every time connection request will be saved in the database
// save -> It is event handler
connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this
    // Here i am checking the fromUserId and toUserId is same if it is save then dont save the documents in the collection
    // fromUserId:ObjectId('686770ff33827b338dbae390')
    // toUserId:ObjectId('686632fc8911e929c08099a1')
    // I am using the equal method because it is objectId not a string
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('Cannot sent connection request yourself')
    };
    // Because this is the middleware
    next()
})

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports=ConnectionRequestModel;