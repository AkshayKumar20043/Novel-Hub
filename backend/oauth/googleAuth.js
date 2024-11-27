const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { writeFile, readFile } = require('../models/info');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secret_key = process.env.JWT_SECRET;

const googleAuthController = async (req, res) => {
  const { token } = req.body;

  try {
    const googleUserInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { email, sub, name, picture } = googleUserInfo.data;

    const users = readFile(usersFilePath);
    let user = users.find((u) => u.email === email);

    if (!user) {
      // If the user doesn't exist, create a new one
      const newUser = {
        id: uuidv4(),
        name,  // Store the user's name
        email,
        password: sub,  // Store Google sub as a unique identifier
        role: 'user',
        picture,  // Optionally store the user's profile picture
      };
      users.push(newUser);
      writeFile(usersFilePath, users);

      user = newUser;
    }

    // Step 3: Generate JWT
    const userToken = jwt.sign({ userId: user.id }, secret_key, { expiresIn: '1d' });

    // Step 4: Send the JWT token in the response
    return res.status(200).json({
      msg: "Login successful",
      token: userToken,
    });

  } catch (err) {
    console.error("Google login failed:", err.message);
    return res.status(401).json({ msg: 'Invalid Google token or request' });
  }
};

module.exports = { googleAuthController };



// const { OAuth2Client } = require('google-auth-library');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const { writeFile, readFile } = require('../models/info');

// const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
// const redirectUrl = "http://localhost:3002/api/oauth/google-login"
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// const secret_key = process.env.jwt_secret

// const googleAuthController = async (req, res) => {
//   const { token } = req.body;
//   console.log(token)

//   try {
//     // Verify the Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token, 
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     console.log(ticket)

//     const payload = ticket.getPayload();
//     const { email, sub, name } = payload;  // Extract name from the payload

//     const users = readFile(usersFilePath);
//     let user = users.find((u) => u.email === email);

//     if (!user) {
//       // If the user doesn't exist, create a new one
//       const newUser = {
//         id: uuidv4(),
//         name,  // Store the user's name
//         email,
//         password: sub,  // Store Google sub as a unique identifier
//         role: 'user',
//       };
//       users.push(newUser);
//       writeFile(usersFilePath, users);

//       user = newUser;
//     }

//     // Generate JWT
//     const userToken = jwt.sign({ userId: user.id }, secret_key, {expiresIn: '1d'});
//     res.cookie("token", token)
//     return res.status(200).json({
//         msg: "Login successful...",
//         token: userToken
//     });
    
//   } catch (err) {
//     res.status(401).json({ msg: 'Invalid Google token' });
//   }
// };

module.exports = { googleAuthController };

