const express = require("express")
const router = express.Router();
const imageControllers = require("../controllers/image")
const upload = require("../middleware/multer")


// //routes for uploading must have a path in this format because the word after the first "-" corresponds to the destination folder for multer
// router.post("/upload-home-image", upload.single("image"), imageControllers.uploadImage)

// router.post("/upload-services-image", upload.single("image"), imageControllers.uploadImage)

// router.post("/upload-private-paint-parties-image", upload.single("image"), imageControllers.uploadImage)

// router.post("/upload-paint-night-image", upload.single("image"), imageControllers.uploadImage)

// router.post("/upload-paint-kits-image", upload.single("image"), imageControllers.uploadImage)

// router.post("/upload-gallery-image", upload.single("image"), imageControllers.uploadImage)

router.post("/upload-image", upload.single("image"), imageControllers.uploadImage)

router.post("/upload-gallery-images", upload.array("image"), imageControllers.uploadGalleryImages)

router.delete("/delete-gallery-images", imageControllers.deleteGalleryImages)





router.get("/get-home-image-content", imageControllers.getImageContent)

router.get("/get-services-image-content", imageControllers.getImageContent)

router.get("/get-private-paint-parties-image-content", imageControllers.getImageContent)

router.get("/get-paint-night-image-content", imageControllers.getImageContent)

router.get("/get-paint-kits-image-content", imageControllers.getImageContent)

router.get("/get-about-image-content", imageControllers.getImageContent)

router.get("/get-gallery-image-content", imageControllers.getImageContent)

module.exports = router;