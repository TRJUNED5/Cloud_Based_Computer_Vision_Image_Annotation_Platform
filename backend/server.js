import express from "express";
import mongoose from "mongoose";
import ImageModel from "./model/image_model.js"
import multer from "multer";
import dotenv from "dotenv"

const app = express();
app.use(express.json())

dotenv.config()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

app.post("/single", upload.single("image"),async (req,res)=>{
    try {
        const { path, filename} = req.file
        const image = await ImageModel({path, filename})
        await image.save()
        res.send({"msg":"Image uploaded"})
    } catch (error) {
        res.send({"error":"Unable to upload Image"})
    }
})

app.listen(5000, async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected")
        console.log("App is running pon port 5000")
    } catch (error) {
        console.log("Error in connecting with database")
    }
})