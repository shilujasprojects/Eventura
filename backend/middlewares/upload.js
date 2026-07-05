// Multer configuration for image uploads

const multer = require("multer");
// const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  }, // Folder where uploaded files will be stored
  filename: (req, file, cb) => {
    // cb - Callback function used to return the filename ; file - Information about the uploaded file
    // A function where Multer gives request data and file details, and you return the final filename using cb().

    cb(null, Date.now() + "-" + file.originalname); // Unique filename
    // Set a unique filename for the uploaded file
    // Date.now() → current timestamp to avoid duplicate names
    // path.extname(file.originalname) → keeps original file extension (.jpg, .png etc.)
  },
});

const upload = multer({ storage }); // Create Multer middleware using the defined storage settings

module.exports = upload;
