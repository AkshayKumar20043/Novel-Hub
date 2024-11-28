// routes/authorRoutes.js
const express = require('express');
const authorRouter = express.Router();
const authorController = require('../controllers/authorController');
const isLoggedIn = require('../authentication/authentication');

authorRouter.get('/', isLoggedIn, authorController.getAuthors);
authorRouter.get('/dashboard', isLoggedIn, authorController.getAuthorById);

authorRouter.get('/author-dashboard/:userId', authorController.getAuthorByUserId);

authorRouter.post('/applyAuthorship', authorController.applyForAuthor);

module.exports = authorRouter;






// authorRouter.js:

// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Path to the authors.json file
// const authorsFilePath = path.join(__dirname, '../data/authors.json');

// // Get all authors
// router.get('/', (req, res) => {
//   fs.readFile(authorsFilePath, 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading authors data.' });
//     }
//     const authors = JSON.parse(data);
//     res.json(authors);
//   });
// });


// // API to fetch author details by user ID
// router.get('/authorByUserId/:userId', (req, res) => {
//     const { userId } = req.params;
//     const authors = readFile(authorsFilePath);
//     const author = authors.find((auth) => auth.userId === userId);

//     if (!author) {
//         return res.status(404).json({ msg: "Author not found" });
//     }

//     res.status(200).json(author);
// });


// // Get a specific author by ID
// router.get('/:id', (req, res) => {
//   const authorId = req.params.id;
//   fs.readFile(authorsFilePath, 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error reading authors data.' });
//     }
//     const authors = JSON.parse(data);
//     const author = authors.find((a) => a.id === authorId);
//     if (!author) {
//       return res.status(404).json({ error: 'Author not found.' });
//     }
//     res.json(author);
//   });
// });

// module.exports = router;