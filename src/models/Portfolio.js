import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    schemeCode:{
        type:Number,
        required:true
    },
    units:{
        type:Number,
        required:true,
        min: 0
        
    },
    purchaseDate:{
        type:Date,
        default:Date.now
    },
    
},
{
    timestamps:true
}
)

export default mongoose.model("Portfolio",portfolioSchema);