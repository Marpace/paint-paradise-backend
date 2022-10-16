const Image = require("../models/image");
const fs = require("fs");
const stream = require("stream");
const {google, drive_v3} = require("googleapis")
require("dotenv").config()

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

const drive = new google.drive({
  version: "v3",
  auth: oauth2Client
})

//upload image to google drive
const uploadFile = async (fileObject) => {

  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  const { data } = await drive.files.create({
    media: {
      mimeType: fileObject.mimetype,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: ['1plxA5pDVAMjaNNby8AiPgTTF8aXzit6u'],
    },
    fields: 'id,name',
  });
  console.log("File uploaded to google drive")
  return data.id;
};


// delete image from google drive
const deleteFile = async (fileId) => {
  const result = await drive.files.delete({
      fileId: fileId
  })
  console.log("deleted old image from google drive")
  return result;
};

//fetch images based on the req.url 
exports.getImageContent = (req, res) => {
  
  // isolate the page from req.url string to know which images to fetch
  const page = req.url.substring(req.url.indexOf("-") + 1, req.url.indexOf("-image-content") );

  Image.find({"location.page": {$eq: page}})
  .then( docs => {
    res.status(200).json({content: docs})
  })
  .catch( err => {
    console.log(err)
  })
};

//uploads new image and deletes old image from google drive, also updates mongoDB doc
exports.uploadImage = async (req, res) => {
  const image = req.file
  const contentId = req.body.contentId

  try {
    const newId = await uploadFile(image)
    const doc = await Image.findByIdAndUpdate(contentId, {
      "$set": {"path": `https://drive.google.com/uc?id=${newId}`, "googleId": newId}
    })
    console.log(`Uploaded the following document: ${doc}`)
    await deleteFile(doc.googleId)
    res.status(200).json()
  } 
  catch (err) {
    console.log(err)
  }
}

//Uploads one or more images to google drive and creates document in mongoDB for each image
exports.uploadGalleryImages = async (req, res) => {
  const images = req.files;
  index = 1;

  try {
    docsCount = await Image.countDocuments({"location.page": "gallery"});
    let order = docsCount + 1
    console.log(order)
    images.forEach( async (image) => {
      const id = await uploadFile(image)
      await Image.create({
        location: {
          page: "gallery",
          section: "grid"
        },
        type: {
          name: "image",
        },
        order: order,
        path: `https://drive.google.com/uc?id=${id}`, 
        googleId: id
      })
      console.log(
        `Added the following image to the gallery:
        order: ${order}
        googleId: ${id}`
      )
      order++;
    })
    res.status(200).json();
  } catch(err) {
    console.log(err)
  }

  // use for uploading many images to google drive and database(customize Image.create() method)
  // images.forEach(async (image) => {
  //   try {
  //     const id = await uploadFile(image)
  //     await Image.create({
  //       location: {
  //         page: "home",
  //         section: "content"
  //       },
  //       type: {
  //         name: "image"
  //       },
  //       order: index,
  //       path: `https://drive.google.com/uc?id=${id}`,
  //       googleId: id
  //     })
  //     index++
  //   } 
  //   catch(err) {
  //     console.log(err)
  //   }
  // })

}

//deletes one or more selected images from google drive and deletes corresponding document from database
exports.deleteGalleryImages = (req, res) => {
  const imageIds = req.body.imageIds

  imageIds.forEach( async (id) => {
    try {
      await deleteFile(id);
      const doc = await Image.findOneAndDelete({googleId: id})
      console.log(
        `Deleted the following gallery image:
        order: ${doc.order}
        id: ${doc._id}
        googleId: ${doc.googleId}`
      )
      const docs = await Image.find({"location.page": "gallery", order: {$gt: doc.order}})
      docs.forEach( doc => {
        doc.order += 1;
        doc.save();
      })
      res.status(200).json();
    }
    catch (err) {
      console.log(err)
    }
  })
}

