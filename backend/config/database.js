import mongoose from "mongoose"
const conncetDB=async()=>{
await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("database connected")
  }).catch((error)=>{
    console.log(error);
  })
}

export default conncetDB;