import express from "express";
import dotenv from "dotenv";
import conncetDB from "./config/database.js";
import userRoute from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js"
dotenv.config();
const app=express();

const PORT=process.env.PORT ||5080;

app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute)


app.listen(PORT,()=>{
    conncetDB()
    console.log(`server running on port ${PORT}`)
})
