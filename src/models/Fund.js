import mongoose from "mongoose";

const fundSchema = new mongoose.Schema({
    schemeCode:{
        type:Number,
        required: true,
        unique: true
    },
    schemeName:{
        type:String,
        
    },
    isinGrowth:{
        type:String,

    },
    isinDivReinvestment:{
        type:String,
    },
    fundHouse:{
        type:String,
    },
    schemeType:{
        type:String,
    },
    schemeCategory:{
        type:String,
    }
})

export default mongoose.model('Fund',fundSchema);