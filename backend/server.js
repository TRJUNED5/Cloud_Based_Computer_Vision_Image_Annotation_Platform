import express from "express";
import multer from "multer";

const app = express();
app.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    
    cb(null, Date.now()+ "-" + file.originalname)
  }
})

const upload = multer({ storage })

app.post("/single", upload.single("image"),(req,res)=>{
    console.log(req.file)
})

app.listen(5000, () =>{
    console.log("App is running")
})