const express = require('express');
const novelRouter = express.Router();
const novelController = require('../controllers/novelController');
const isLoggedIn = require('../authentication/authentication');
const upload = require('../middlewares/multer');

// GET routes
novelRouter.get('/', novelController.getNovels);
novelRouter.get('/search', novelController.searchNovels);
novelRouter.get('/:id', novelController.getNovelById);
novelRouter.get('/title/:title', isLoggedIn, novelController.getNovelByTitle);
novelRouter.get('/:novelId/chapters', novelController.getChaptersByNovelId);
novelRouter.get('/reviews', novelController.getReviews);
novelRouter.get('/:novelId/reviews', novelController.getReviewsByNovelId);
novelRouter.get('/:novelId/reviews/:reviewId', novelController.getReviewsById);
novelRouter.get('/sort', novelController.sortNovels);
novelRouter.get('/top', novelController.getTopNovels);
novelRouter.get('/:novelId/chapters/:chapterId', novelController.getChapterById);

// POST routes with file uploads
novelRouter.post('/', isLoggedIn, upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 }
]), novelController.uploadNovel);

novelRouter.post('/:novelId/chapters', isLoggedIn, novelController.uploadChapter);
novelRouter.post('/:novelId/reviews', isLoggedIn, novelController.uploadReview);
novelRouter.post('/:novelId/reviews/:reviewId', novelController.addReplyToReview);

module.exports = novelRouter;
