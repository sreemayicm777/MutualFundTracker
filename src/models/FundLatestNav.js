import mongoose from "mongoose";

const  fundLatestNavSchema =  new mongoose.Schema({
    schemeCode:{
        type:Number,
        required:true,
        unique:true
    },
    nav:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },

},
{
    timestamps:true
})

export default mongoose.model('FundLatestNav',fundLatestNavSchema);
