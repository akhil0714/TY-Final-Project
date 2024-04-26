import mongoose from "mongoose";

export const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbname : "DG_CASHEW"
    })
    .then(()=>console.log("Database Connected Successfully"))
    .catch((e)=>console.log(e))
}