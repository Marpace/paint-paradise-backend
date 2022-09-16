const Image = require("../models/image");
const fs = require("fs");
const stream = require("stream");
const {google} = require("googleapis")


//upload image to google drive
const uploadFile = async (fileObject) => {
  const KEYFILEPATH = './ServiceAccountCred.json';
  const SCOPES = ['https://www.googleapis.com/auth/drive'];
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
  });
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  const { data } = await google.drive({ version: 'v3', auth }).files.create({
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
  const KEYFILEPATH = './ServiceAccountCred.json';
  const SCOPES = ['https://www.googleapis.com/auth/drive'];
  const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES
  });

  const result = await google.drive({ version: 'v3', auth }).files.delete({
      fileId: fileId
  })
  return result;
};

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

  console.log(image)

  Image.findById(contentId)
  .then( doc => {
    console.log(doc.googleId)
    return deleteFile(doc.googleId)
  })
  .then(() => {
    console.log("deleted file form google drive")
    return uploadFile(image)
  })
  .then( newId => {
    console.log("uploaded file to google drive")
    return Image.findByIdAndUpdate(contentId, {
      "$set": {"path": `https://drive.google.com/uc?id=${newId}`, "googleId": newId}
    })
  })
  .then( doc => {
    console.log(doc)
    console.log("updated image")
    res.status(200).json()
  })
  .catch( err => console.log(err))
}

exports.uploadGalleryImages = async (req, res) => {
  const images = req.files;
  let order;

  try {
    docs = await Image.find({"location.page": "gallery"});
    let order = docs.length + 1
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
      order++;
    })
    res.status(200).json();
  } catch(err) {
    console.log(err)
  }





  // Image.find({})
  // .then(docs => {

  // })

  // images.forEach( image => {
  //   uploadFile(image)
  //   .then( id => {
  //     return Image.create({
  //       location: {
  //         page: "gallery",
  //         section: "grid"
  //       },
  //       type: {
  //         name: "image",
  //       },
  //       order: ,
  //       path: `https://drive.google.com/uc?id=${id}`, 
  //       googleId: id
  //     })
  //   })
  //   .then(() => {
  //     res.status(200).json();
  //   })
  //   .catch(err => console.log(err))
  // })
}

exports.deleteGalleryImages = (req, res) => {
  const imageIds = req.body.imageIds
  console.log(imageIds) 

  imageIds.forEach(id => {
    deleteFile(id)
    .then(() => {
      return Image.findOneAndDelete({googleId: id})
    })
    .then((doc) => {
      console.log(doc)
      return Image.find({"location.page": "gallery", order: {$gt: doc.order}})
    })
    .then(docs => {
      docs.forEach( doc => {
        doc.order = doc.order - 1;
        doc.save();
      })
      res.status(200).json();
    })
    .catch( err => console.log(err))
  })
}
