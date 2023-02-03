const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express();
const port = 8080 || process.env.port

const Text = require("./models/text");
const Image = require("./models/image");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const textRoutes = require("./routes/text")
const imageRoutes = require("./routes/image")
const authRoutes = require("./routes/auth")



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
      app.use(authRoutes);

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

    // for(let i = 1; i <= 3; i++){
    //     Image.create({
    //         location: {
    //             page: "home",
    //             section: "content"
    //         },
    //         type: {
    //             name: "image"
    //         },
    //         order: i,
    //         path: ""
    //     })
    // }

    //   Image.insertMany([
    //     {
    //       location: {
    //         page: "global",
    //         section: "navbar"
    //       },
    //       type: {
    //         name: "image"
    //       },
    //       path: "https://drive.google.com/uc?id=1CCfJBLH-72bTsB6MVV10vZxy1Vg7rFOR",
    //       googleId: "1CCfJBLH-72bTsB6MVV10vZxy1Vg7rFOR"
    //     },
    //   ])

        // Image.find({"location.section": "adult-parties"})
        // .then(docs => {
        //     // let index = 1;
        //     docs.forEach( doc => {
        //         doc.location.section = "Adult parties";
        //         doc.save();
        //         // index++;
        //         console.log(doc)
        //     })
        // })
        // .catch( err => console.log(err))

  
        // Image.deleteMany({"location.page": "gallery"})
        // .then(result => console.log(result))
        // .catch(err => console.log(err))

        // function createUser(username, password, role) {
        //     bcrypt.hash(password, 12)
        //     .then(hashedPw => {
        //         return User.create({
        //             userName: username,
        //             password: hashedPw,
        //             role: role
        //         })
        //     })
        //     .then(() => {
        //         console.log("user created")
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     });
        // }
        // createUser();




        app.listen(port, function(err){
            if(err) console.log(err);
            else console.log("Server started on port: " + port)
        });

    });
