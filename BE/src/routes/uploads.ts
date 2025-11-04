import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request, Response } from 'express';

const router: Router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
        cb(null, uploadsDir);
    },
    filename: (_req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (_req: any, file: any, cb: any) => {
        // Allow only image files
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

/**
 * POST /uploads
 * Upload an image file and return the URL
 */
router.post('/', upload.single('image'), (req: Request, res: Response) => {
    try {
        const file = (req as any).file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return relative URL for the uploaded image
        const imageUrl = `/uploads/${file.filename}`;
        res.json({ data: { imageUrl } });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;