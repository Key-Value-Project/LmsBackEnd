import multer from 'multer';
import path from 'path';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Specify the destination directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // console.log('File details:', file);
    const filetypes = /xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const mimetype = mimetypes.includes(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only Excel with .xlsx are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

export default upload;
