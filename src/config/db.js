import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_URL);
        console.log("DB Connected to:", connect.connection.name);
        console.log("Database:", connect.connection.db.databaseName);
        
        // List all collections in the database
        const collections = await connect.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        
    } catch (err) {
        console.log("Database connection error:", err.message);
        process.exit(1);
    }
}

export default connectDB;