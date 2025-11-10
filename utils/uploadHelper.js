const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

// Instantiate a storage client
const storage = new Storage();

// Multer is required to process file uploads and make them available via req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Function to upload file to Google Cloud Storage
const uploadFileToGCS = (file) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", () => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = {
  multer,
  uploadFileToGCS,
};