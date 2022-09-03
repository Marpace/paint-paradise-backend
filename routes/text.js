const express = require("express");
const router = express.Router();
const textController = require("../controllers/text")


//the string between "get-" and "-text-content" in the route path refers to the database query in the controller
router.get("/get-global-text-content", textController.getGlobalTextContent)

router.get("/get-home-text-content", textController.getTextContent)

router.get("/get-services-text-content", textController.getTextContent)

router.get("/get-private-paint-parties-text-content", textController.getTextContent)

router.get("/get-paint-night-text-content", textController.getTextContent)

router.get("/get-paint-kits-text-content", textController.getTextContent)

router.get("/get-about-text-content", textController.getTextContent)

router.post("/update-text-content", textController.updateTextContent)


module.exports = router;