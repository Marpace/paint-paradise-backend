const multer = require("multer")

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const page = req.url.substring(req.url.indexOf("-") + 1, req.url.indexOf("-image"));
    function setDest(page){
      if(
        page === "private-paint-parties" || 
        page === "paint-night" || 
        page === "paint-kits"
      ) {
        page = `services/${page}`
      }
      return page
    }


    cb(null, `../frontend/public/images/${setDest(page)}`)  
  },
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({storage: imageStorage, fileFilter: fileFilter});
