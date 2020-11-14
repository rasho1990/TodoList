const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dfdocrzsc',
  api_key: '582468717998973',
  api_secret: 'rd-_Ew_sI9Aiyq5SpMa9ZN5YTxo',
});

module.exports = cloudinary;