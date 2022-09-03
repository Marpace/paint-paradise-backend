const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express();
const port = 8080 || process.env.port

const Text = require("./models/text");
const Image = require("./models/image");

const textRoutes = require("./routes/text")
const imageRoutes = require("./routes/image")



mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
      const port = process.env.PORT || 8080
      
      app.use(express.json());
      app.use(cors());

      app.use(textRoutes);
      app.use(imageRoutes);

    // Text.insertMany([
    //     {
    //         location: {
    //             page: "about",
    //             section: "instagram"
    //         },
    //         type: {
    //             name: "heading"
    //         },
    //         order: 2,
    //         content: "Check out her work on instagram!"
    //     },
    // ]);


    //   Image.insertMany([
    //     {
    //       location: {
    //         page: "about",
    //         section: "header"
    //       },
    //       type: {
    //         name: "image"
    //       },
    //       path: "/images/services/about/about_1.jpg"
    //     },
    //   ])
        app.listen(port, function(err){
            if(err) console.log(err);
            else console.log("Server started on port: " + port)
        });

    });
