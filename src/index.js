// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
// import mongoose, { mongo } from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB();























/*
//code to connnect db as profeesional

import express from "express";
const app = express();

(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (err) => {
            console.log("Error : ", err)
            throw err;
        });
        app.listen(process.env.PORT || 3500, () => {
            console.log(`Server is running on port ${process.env.PORT} `);
        });
        
    } catch (error) {
        console.log("ERROR: ", error);
        throw error
        
    }
})()
*/
