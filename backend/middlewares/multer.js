const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure directories exist
const coverPhotoPath = path.join(__dirname, '..', 'public', 'images', 'novelcovers');
const otherFilesPath = path.join(__dirname, '..', 'public', 'images', 'posts');
const videoPath = path.join(__dirname, '..', 'public', 'introduction-videos');

if (!fs.existsSync(coverPhotoPath)) {
    fs.mkdirSync(coverPhotoPath, { recursive: true });
}

if (!fs.existsSync(otherFilesPath)) {
    fs.mkdirSync(otherFilesPath, { recursive: true });
}

if (!fs.existsSync(videoPath)) {
    fs.mkdirSync(videoPath, { recursive: true });
}

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'coverPhoto') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for cover photos!'), false);
        }
    } else if (file.fieldname === 'introVideo') {
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid video format! Please upload MP4, WebM, or OGG video.'), false);
        }
    } else if (file.fieldname === 'image') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for posts!'), false);
        }
    } else {
        cb(null, true);
    }
};

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'coverPhoto') {
            cb(null, coverPhotoPath);
        } else if (file.fieldname === 'introVideo') {
            cb(null, videoPath);
        } else if (file.fieldname === 'image') {
            cb(null, otherFilesPath);
        } else {
            cb(null, otherFilesPath);
        }
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4();
        cb(null, uniqueFilename + path.extname(file.originalname));
    }
});

// Create multer instance with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: (req, file) => {
            if (file.fieldname === 'introVideo') {
                return 50 * 1024 * 1024; // 50MB for videos
            }
            return 5 * 1024 * 1024; // 5MB for other files
        }
    }
});

module.exports = upload;
