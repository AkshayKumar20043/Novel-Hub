const express = require('express');
const router = express.Router();
const upload = require('../middlewares/cloudinaryStore');
const isLoggedIn = require('../authentication/authentication');
const { addPosts, getAllPosts, addCommentToPost, getPostById, getPostsByUserId, togglePostLike, toggleCommentLike } = require('../controllers/postController');

// GET routes
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.get('/user/:userId', getPostsByUserId);

// POST routes
router.post('/', isLoggedIn, upload.single('image'), addPosts);
router.post('/:postId/comments', isLoggedIn, addCommentToPost);
router.post('/:postId/like', isLoggedIn, togglePostLike);
router.post('/:postId/comments/:commentId/like', isLoggedIn, toggleCommentLike);

module.exports = router;
