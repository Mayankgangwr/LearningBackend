import multer, { StorageEngine } from 'multer';
import { Request } from 'express';
import { CallbackError } from 'mongoose';

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: CallbackError | null, destination: string) => void) {
        cb(null, './public/temp');
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: CallbackError | null, filename: string) => void) {
        cb(null, file.originalname);
    }
});

export const uploadFile = multer({
    storage
});
