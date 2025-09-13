import express from "express"
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import fundRoutes from "./routes/fundRoutes.js";
import navRoutes from "./routes/navRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());



//Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio",portfolioRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/nav",navRoutes);


export default app;