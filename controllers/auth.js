const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const {google} = require("googleapis")

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)


oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

let verificationCode;

exports.login = async (req, res, next) => {
  const userName = req.body.username
  const password = req.body.password

  try {
    const user = await User.findOne({userName: userName})
    const isEqual = await bcrypt.compare(password, user.password)
    if(!user || !isEqual) {
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

exports.sendVerificationCode = (req, res) => {

  function generateCode() {
    let result = "";
    for ( let i = 0; i < 6; i++ ) {
      result += (Math.floor(Math.random() * 10));
    }
    return result;
  }

  verificationCode = generateCode();

  try { 
    const accessToken = oauth2Client.getAccessToken();
  
    let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.NODEMAILER_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    
  
  
    let mailOptions = {
        from: '"Myself" <almonacid6215@gmail.com>',
        to: "almonacid6215@gmail.com",
        subject: "Password Reset Code",
        text: "Please use 0000 as your verification code.", 
        html: `<b>Please use ${verificationCode} as your verification code.</b>`
    };
  
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        throw error;
      }
      console.log('Verification code sent');
      console.log(verificationCode)
    });

  }
  catch(err) {
    console.log(err)
  }

}

exports.verifyCode = (req, res) => {
  const code = req.body.code;
  console.log(code)

  try {
    if(code !== verificationCode) {
      const err = new Error("Invalid code!")
      throw err;
    }
    res.status(200).json()
  }
  catch(err) {
    console.log(err.message)
    res.status(401).json()
  }
}

exports.resetPassword = async (req, res) => {
  const newPassword = req.body.newPassword;
  const confirmedPassword = req.body.confirmedPassword

  console.log("new password:" + newPassword)
  console.log("confirmed password:" + confirmedPassword)

  try {
    if(newPassword !== confirmedPassword) {
      const err = new Error("Passwords do not match")
      throw err;
    }

    const hashedPw = await bcrypt.hash(newPassword, 12)
    const users = await User.find({})
    
    users[0].password = hashedPw;
    await users[0].save()

    res.status(200).json();
    console.log("Password updated")

  } catch (err) {
    console.log(err.message)
    res.status(400).json({message: err.message})
  }
}


// register new users for CMS. Need to npm install and require 'express-validator'
//Also need to modify resetPassword function to query the User collection since there will be more than one user
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