import mongoose from "mongoose";


const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(process.env.DB_URL);
        console.log("DB Connected",connect.connection.name);
    }catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;