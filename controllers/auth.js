const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res, next) => {
  const userName = req.body.username
  const password = req.body.password

  console.log(userName)

  try {
    const user = await User.findOne({userName: userName})
    if(!user) {
      const err = new Error("A user with that username does not exist")
      err.statusCode = 401;
      throw err;
    }  
    const isEqual = await bcrypt.compare(password, user.password)
    if(!isEqual) {
      const err = new Error("Username or password is incorrect, please try again.")
      err.statusCode = 401;
      throw err;
    }
    const token = jwt.sign(
      {
        userName: user.userName,
        userId: user._id.toString()
      },
      'longsecretstring',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } 
  catch (err) {
    console.log(err)
    next(err)
  }
}


// register new users for CMS. Need to npm install and require 'express-validator'
// exports.register = (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed.');
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
//   const userName = req.body.userName;
//   const password = req.body.password;
//   const role = req.body.role;

//   bcrypt
//     .hash(password, 12)
//     .then(hashedPw => {
//       const user = new User({
//         userName: userName,
//         password: hashedPw,
//         role: role
//       });
//       return user.save();
//     })
//     .then(result => {
//       res.status(201).json({ message: 'User created!', userId: result._id });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//     });
// };