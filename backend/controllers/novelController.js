const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { writeFile, readFile } = require('../models/info');

const authorsFilePath = path.join(__dirname, '..', 'data', 'authors.json');
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
const novelsFilePath = path.join(__dirname, '..', 'data', 'novels.json');
const chaptersFilePath = path.join(__dirname, '..', 'data', 'chapters.json');
const reviewsFilePath = path.join(__dirname, '..', 'data', 'reviews.json');

const uploadNovel = (req, res) => {
    try {
        const novels = readFile(novelsFilePath);
        const { title, description, authorId } = req.body;
        let introVideo = req.body.introVideo; // For YouTube URL
        
        if (!title || !description || !authorId) {
            return res.status(400).json({ msg: "Please provide all required fields" });
        }

        // Handle video upload or YouTube URL
        if (req.files && req.files.introVideo) {
            // If a video file was uploaded
            introVideo = `/introduction-videos/${req.files.introVideo[0].filename}`;
        } else if (!introVideo) {
            introVideo = null;
        } else if (introVideo && !introVideo.includes('youtube.com/embed')) {
            const videoId = extractYouTubeVideoId(introVideo);
            if (videoId) {
                introVideo = `https://www.youtube.com/embed/${videoId}`;
            }
        }

        const newNovel = {
            id: uuidv4(),
            title,
            description,
            coverPhoto: req.files && req.files.coverPhoto ? req.files.coverPhoto[0].filename : null,
            introVideo,
            timestamp: new Date().toLocaleString(),
            likes: 0,
            reviews: [],
            chapters: [],
            authorId
        };

        novels.push(newNovel);
        writeFile(novelsFilePath, novels);

        res.status(201).json(newNovel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error uploading novel" });
    }
};

// Helper function to extract YouTube video ID
const extractYouTubeVideoId = (url) => {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
        /(?:https?:\/\/)?youtu\.be\/([^?]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};


const getNovels = (req, res) => {
    try {
        const novels = readFile(novelsFilePath);
        res.status(200).json(novels);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}

const getNovelById = (req, res) => {
    try {
        const novels = readFile(novelsFilePath);
        for (let i = 0; i < novels.length; i++) {
            if (novels[i].id == req.params.id) {
                res.status(200).json(novels[i]);
            }
        }
    } catch (error) {
        res.status(404).send("No novel found...");
    }
}

const getNovelByTitle = (req, res) => {
    const novels = readFile(novelsFilePath);
    const novelsFound = [];
    for (let i = 0; i < novels.length; i++) {
        if (novels[i].title == req.params.title) {
            novelsFound.push(novels[i]);
        }
    }
    if (novelsFound.length > 0) {
        res.status(200).json(novelsFound);
    } else {
        res.status(404).send("No novels found...");
    }
}

const uploadChapter = (req, res) => {
    const { novelId } = req.params;
    const { chapterName, chapterContent } = req.body;

    if (!novelId || !chapterName || !chapterContent) {
        res.status(400).json({ msg: "Chapter Content required." });
    }

    const novels = readFile(novelsFilePath);
    let novel = null;
    for (let i = 0; i < novels.length; i++) {
        if (novels[i].id === novelId) {
            novel = novels[i];
            break;
        }
    }

    if (!novel) {
        return res.status(404).json({ msg: "Novel not found" });
    }

    const chapterNumber = novel.chapters.length + 1;

    const newChapter = {
        id: uuidv4(),
        novelId: novelId,
        chapterNumber: chapterNumber,
        chapterName: chapterName,
        chapterContent: chapterContent,
        timestamp: new Date().toLocaleString(),
    };

    const chapters = readFile(chaptersFilePath);

    chapters.push(newChapter);
    writeFile(chaptersFilePath, chapters);

    novel.chapters.push(newChapter.id);
    writeFile(novelsFilePath, novels);

    return res.status(201).json({ msg: "Chapter uploaded", chapter: newChapter });
};

const getChaptersByNovelId = (req, res) => {
    const { novelId } = req.params;

    const chapters = readFile(chaptersFilePath);
    const novelChapters = [];

    for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].novelId === novelId) {
            novelChapters.push(chapters[i]);
        }
    }

    if (novelChapters.length === 0) {
        return res.status(404).json({ msg: "No chapters found for this novel." });
    }

    novelChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    return res.status(200).json(novelChapters);
};

const uploadReview = (req, res) => {
    const { novelId } = req.params;
    const { userId, reviewTitle, reviewContent } = req.body;

    if (!userId || !novelId || !reviewTitle || !reviewContent) {
        res.status(400).json({ msg: "Review Content required." });
    }

    const novels = readFile(novelsFilePath);
    let novel = null;
    for (let i = 0; i < novels.length; i++) {
        if (novels[i].id === novelId) {
            novel = novels[i];
            break;
        }
    }

    if (!novel) {
        return res.status(404).json({ msg: "Novel not found" });
    }

    const newReview = {
        id: uuidv4(),
        userId: userId,
        novelId: novelId,
        reviewTitle: reviewTitle,
        reviewContent: reviewContent,
        likes: 0,
        replies: [],
        timestamp: new Date().toLocaleString(),
    };

    const reviews = readFile(reviewsFilePath);

    reviews.push(newReview);
    writeFile(reviewsFilePath, reviews);

    novel.reviews.push(newReview.id);
    writeFile(novelsFilePath, novels);

    const users = readFile(usersFilePath);
    let user = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            user = users[i];
            break;
        }
    }
    if (user) {
        user.reviews.push(newReview.id);
        writeFile(usersFilePath, users);
    } else {
        return res.status(404).json({ msg: "User not found." });
    }

    return res.status(201).json({ msg: "Review uploaded", chapter: newReview });
};

const addReplyToReview = (req, res) => {
    const { content } = req.body;
    const reviews = readFile(reviewsFilePath);
    let review = null;
    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].id == req.params.reviewId) {
            review = reviews[i];
            break;
        }
    }

    if (!review) {
        res.status(400).json({ msg: "Review not found" });
    }

    const reply = {
        id: uuidv4(),
        content: content,
        likes: 0,
        reviewId: req.params.reviewId,
        timestamp: new Date().toLocaleString()
    };
    review.replies.push(reply);
    writeFile(reviewsFilePath, reviews);

    res.status(201).json(reply);
};

const getReviews = (req, res) => {
    try {
        const reviews = readFile(reviewsFilePath);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReviewsByNovelId = (req, res) => {
    try {
        const reviews = readFile(reviewsFilePath);
        const reviewsFound = [];
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].novelId === req.params.novelId) {
                reviewsFound.push(reviews[i]);
            }
        }
        res.status(200).json(reviewsFound);
    } catch (error) {
        res.status(404).json('No reviews found');
    }
}
const getReviewsById = (req, res) => {
    try {
        const reviews = readFile(reviewsFilePath);
        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].id == req.params.reviewId) {
                res.status(200).json(reviews[i]);
            }
        }
    } catch (error) {
        res.status(404).json('No reviews found');
    }
}

const searchNovels = (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ msg: "Search query is required" });
        }

        const novels = readFile(novelsFilePath);
        const authors = readFile(authorsFilePath);

        // Case-insensitive search in title, description, and author name
        const results = novels.filter(novel => {
            if (!novel) return false;
            
            const author = authors.find(a => a && a.id === novel.authorId);
            const searchTerm = q.toLowerCase();
            
            return (
                (novel.title && novel.title.toLowerCase().includes(searchTerm)) ||
                (novel.description && novel.description.toLowerCase().includes(searchTerm)) ||
                (author && author.name && author.name.toLowerCase().includes(searchTerm))
            );
        }).map(novel => {
            const author = authors.find(a => a && a.id === novel.authorId) || { id: 'unknown', name: 'Unknown Author' };
            return {
                ...novel,
                author: {
                    id: author.id,
                    name: author.name
                }
            };
        });

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ msg: "Error searching novels" });
    }
};

const getChapterById = (req, res) => {
    const { novelId, chapterId } = req.params;

    const chapters = readFile(chaptersFilePath);
    
    const chapter = chapters.find(chapter => chapter.novelId === novelId && chapter.id === chapterId);

    if (!chapter) {
        return res.status(404).json({ msg: "Chapter not found" });
    }

    return res.status(200).json(chapter);
};

const getTopNovels = (req, res) => {
    try {
        const novels = readFile(novelsFilePath);
        
        // Sorting novels by likes
        const topNovels = novels.sort((a, b) => b.likes - a.likes).slice(0, 5); // Get top 5 novels
        
        res.status(200).json(topNovels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const sortNovels = (req, res) => {
    try {
        const novels = readFile(novelsFilePath);
        const sortBy = req.query.sortBy || 'likes';  // Default to 'likes'

        const sortedNovels = novels.sort((a, b) => {
            if (sortBy === 'likes') {
                return b.likes - a.likes; // Sort by likes in descending order
            } else if (sortBy === 'timestamp') {
                return new Date(b.timestamp) - new Date(a.timestamp); // Sort by timestamp in descending order
            }
            return 0; // Default return if no valid sort parameter
        });

        res.status(200).json(sortedNovels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadNovel,
    getNovels,
    getNovelById,
    getNovelByTitle,
    uploadChapter,
    getChaptersByNovelId,
    uploadReview,
    addReplyToReview,
    getReviews,
    getReviewsByNovelId,
    getReviewsById,
    searchNovels,
    getChapterById,
    getTopNovels,
    sortNovels
};