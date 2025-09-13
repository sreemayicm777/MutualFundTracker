import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { scheduleDailyNAVUpdate } from "./services/navUpdateJob.js";



dotenv.config();
connectDB();
scheduleDailyNAVUpdate();
const PORT = process.env.PORT || 5004

app.listen(PORT, ()=>{
    console.log(`The server is running on ${PORT}` );
});