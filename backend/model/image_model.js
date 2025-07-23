import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    path: {type:String, required:true},
    filename: {type: String, required: true},
    labels: [
        {
      description: String,
      score: Number
    }
    ]
})

const ImageModel = mongoose.model("images", imageSchema)

export default ImageModel;