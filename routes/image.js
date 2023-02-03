const express = require("express")
const router = express.Router();
const imageControllers = require("../controllers/image")
const upload = require("../middleware/multer")




router.post("/upload-image", upload.single("image"), imageControllers.uploadImage)

router.post("/upload-gallery-images", upload.array("image"), imageControllers.uploadGalleryImages)

router.delete("/delete-gallery-images", imageControllers.deleteGalleryImages)




// the word between "get-" and "-image-content" is the query for getting the images from the database

router.get("/get-home-image-content", imageControllers.getImageContent)

router.get("/get-services-image-content", imageControllers.getImageContent)

router.get("/get-private-paint-parties-image-content", imageControllers.getImageContent)

router.get("/get-paint-night-image-content", imageControllers.getImageContent)

router.get("/get-paint-kits-image-content", imageControllers.getImageContent)

router.get("/get-about-image-content", imageControllers.getImageContent)

router.get("/get-gallery-image-content", imageControllers.getImageContent)

module.exports = router;