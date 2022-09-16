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

    // for(let i = 1; i <= 49; i++){
    //     Image.create({
    //         location: {
    //             page: "gallery",
    //             section: "grid"
    //         },
    //         type: {
    //             name: "image"
    //         },
    //         order: i,
    //         path: `./images/gallery/gallery_image (${i})`
    //     })
    // }

    //   Image.insertMany([
    //     {
    //       location: {
    //         page: "home",
    //         section: "services"
    //       },
    //       type: {
    //         name: "image"
    //       },
    //       order: 1,
    //       path: "https://drive.google.com/uc?id=1XMM0UoIBYsNmjaSuqCMqTVf94pPhnA_d"
    //     },
    //   ])

        // Image.find({"location.page": "gallery"})
        // .then(docs => {
        //     let index = 1;
        //     docs.forEach( doc => {
        //         doc.order = index;
        //         doc.save();
        //         index++;
        //         console.log(doc.order)
        //     })
        // })
        // .catch( err => console.log(err))

  
        // Image.deleteMany({"location.section": "get-paint-kit"})
        // .then(result => console.log(result))
        // .catch(err => console.log(err))



        app.listen(port, function(err){
            if(err) console.log(err);
            else console.log("Server started on port: " + port)
        });

    });
