import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import routers from './routers/routers.js';


dotenv.config();

const connectDB = async() => {
  try{
      await mongoose.connect(process.env.MONGODB_URI)
  }
  catch (err){
      console.log(err)
  }
}
connectDB()

const app = express();

app.use(express.json());
app.use(cors({
  origin : ["https://pasteit-ten.vercel.app"],
}));

app.use('/', routers);

mongoose.connection.once('open',() => {
  console.log('mongodb connected')
  app.listen(process.env.PORT, ()=>console.log(`server is running on ${process.env.PORT}`))
})

mongoose.connection.on('error',err => {
  console.log(err)
})

