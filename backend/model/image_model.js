import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    path: {type:String, requied:true},
    filename: {type: String, requied: true},
})

const ImageModel = mongoose.model("images", imageSchema)

export default ImageModel;