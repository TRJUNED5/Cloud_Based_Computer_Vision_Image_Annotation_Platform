import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    path: {type:String, required:true},
    filename: {type: String, required: true},
    labels: [String]
})

const ImageModel = mongoose.model("images", imageSchema)

export default ImageModel;