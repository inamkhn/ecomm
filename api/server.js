import express, { json } from "express";
import products from "./data/Products.js";
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from "mongoose";
import productRouter from './Routes/productRoute.js'
import userRouter from './Routes/userRoute.js'
import orderRouter from './Routes/orderRoute.js'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Stripe from 'stripe';
import path from 'path'
import { connect } from "./config/db.js";
dotenv.config()

const app = express()
const __dirname = path.resolve();
app.use(express.json())
app.use(express.urlencoded({extended: true}));
// app.use(cors())
const corsOptions ={
    origin: 'http://localhost:5173', 
    credentials: true,    
    optionSuccessStatus: 200,
    
}
app.use(cors(corsOptions))
dotenv.config()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/v1",productRouter)
app.use("/api/v1",userRouter)
app.use("/api/v1",orderRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.listen(5000,(req,res)=>{
    connect()
    console.log(`server is runing on 5000`)
})
