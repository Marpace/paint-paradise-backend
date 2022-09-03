const Text = require("../models/text");


exports.getGlobalTextContent = (req, res) => {
  Text.find({"location.page": {$eq: "global"}})
  .then( docs => {
    res.status(200).json({content: docs})
  })
  .catch( err => {
    console.log(err);
  })
};

exports.getTextContent = (req, res) => {
  const page = req.url.substring(req.url.indexOf("-") + 1, req.url.indexOf("-text-content") )
  Text.find({"location.page": {$eq: page}})
  .then( docs => {
    res.status(200).json({content: docs})
  })
  .catch( err => {
    console.log(err)
  })
}

exports.updateTextContent = (req, res) => {
  const contentId = req.body.contentId;
  const content = req.body.content;

  Text.findByIdAndUpdate(contentId, {content: content})
  .then( doc => {
    if(doc !== null) {
      console.log("Updated content successfully")
      res.status(200).json()
    }
    else {
      res.status(404).json();
      throw new Error("Could not find content in database")
    }
  })
  .catch( err => {
    console.log(err)   
  });
};