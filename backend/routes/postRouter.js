const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postController');
const isLoggedIn = require('../authentication/authentication');
const upload = require('../middlewares/multer');

// GET routes
postRouter.get('/', postController.getAllPosts);
postRouter.get('/:id', postController.getPostById);
postRouter.get('/user/:userId', postController.getPostByUserId);

// POST routes
postRouter.post('/', upload.single('image'), postController.addPosts);
postRouter.post('/:postId/comments', isLoggedIn, postController.addCommentToPost);

module.exports = postRouter;