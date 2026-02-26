import express from "express";
import dotenv from "dotenv";
import conncetDB from "./config/database.js";
import userRoute from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js"
import cors from "cors"
dotenv.config();
const app=express();

const PORT=process.env.PORT ||5080;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const corsOprion={
    origin:"http://localhost:5173",
    credentials:true
}
//routes
app.use(cors(corsOprion))
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute)


app.listen(PORT,()=>{
    conncetDB()
    console.log(`server running on port ${PORT}`)
})
