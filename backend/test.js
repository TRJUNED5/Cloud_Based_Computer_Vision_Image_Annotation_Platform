import express from "express";
import mongoose from "mongoose";
import ImageModel from "./model/image_model.js"
import multer from "multer";
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
import vision from "@google-cloud/vision";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static("uploads"))

dotenv.config()

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

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
        const { path:localPath, filename} = req.file;

        const [result] = await client.labelDetection(localPath);
        const labels = result.labelAnnotations.map(label => label.description)

        const image = new ImageModel({path:localPath, filename, labels})
        await image.save()
        res.send({"msg":"Image uploaded", id: image._id, labels})
    } catch (error) {
        res.send({"error":"Unable to upload Image"})
    }
})

app.get("/img/:id", async(req,res)=>{
  const {id} = req.params
  try {
    const image = await ImageModel.findById(id)
    if(!image) res.send({"msg":"Image Not Found"})

    const imagePath = path.join(__dirname, "..","uploads", image.filename)
    res.sendFile(imagePath)
  } catch (error) {
    
  }
})

app.listen(5000, async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database is connected")
        console.log("App is running on port 5000")
    } catch (error) {
        console.log("Error in connecting with database")
    }
})