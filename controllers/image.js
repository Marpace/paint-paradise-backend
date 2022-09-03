const Image = require("../models/image");
const fs = require("fs");


exports.getImageContent = (req, res) => {
  const page = req.url.substring(req.url.indexOf("-") + 1, req.url.indexOf("-image-content") );
  Image.find({"location.page": {$eq: page}})
  .then( docs => {
    res.status(200).json({content: docs})
  })
  .catch( err => {
    console.log(err)
  })
};


exports.uploadImage = (req, res) => {
  const image = req.file
  const contentId = req.body.contentId


  Image.findById(contentId)
  .then( doc => {
    return fs.unlinkSync(`../frontend/public${doc.path}`)
  })
  .then(() => {
    return Image.findByIdAndUpdate(
    contentId, 
    {path: image.destination.substring(image.destination.indexOf("images") - 1) + "/" +image.filename})
  })
  .then( doc => {
    console.log("Updated image")
    res.status(200).json()
  })
  .catch( err => {
    console.log(err)
  })



    // try {
    //   fs.unlinkSync(`../frontend/public${doc.path.substring(doc.path.indexOf('.') + 1)}/${image.filename}`)
    //   console.log("deleted image at:" + doc.path)
    //   Image.findByIdAndUpdate(
    //     contentId, 
    //     {path: `./${image.path.split("\\")[3]}/${image.path.split("\\")[4]}`})
    //     .then( doc => {
    //       console.log("Updated image")
    //       res.status(200).json({message: "Updated image successfully"})
    //     })
    //     .catch( err => {
    //       console.log(err);
    //     })
    // } catch (err) {
    //   console.log(err)
    // }
}

