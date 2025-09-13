import mongoose from "mongoose";

const FundNavHistorySchema = new mongoose.Schema({
       schemeCode:{
        type:Number,
        required:true
       },
       nav:{
        type:Number,
        required:true
       },
       date:{
        type:String,
        required:true,
       },
},{
    timestamps:true
})

export default mongoose.model('FundNavHistory',FundNavHistorySchema);