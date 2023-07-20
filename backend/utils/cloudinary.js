//cloudinary
const cloudinary = require('cloudinary');
const { Errordisplay } = require('./Auth.utils');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImg(file, path) {
  try {
    let files = file ? file : false;
    let paths = path ? path : false;
    if (files != false && paths != false) {
      let upload = await cloudinary.v2.uploader.upload(files.tempFilePath, {
        resource_type: 'image',
        folder: paths,
        use_filename: false,
        unique_filename: true,
      });
      return { url: upload.secure_url, publicID: upload.public_id };
    }
    return { error: 'Images are missing' };
  } catch (error) {
    console.log(error);
    return { error: Errordisplay(error).msg };
  }
}

async function deleteImg(publicIDs) {
  try {
    let publicID = publicIDs ? publicIDs : false;
    console.log(publicID);
    if (publicID != false) {
      await cloudinary.v2.uploader.destroy(publicID);
      return { deleted: true };
    }
    return { error: 'no file like this' };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

async function deleteBulkImg(publicIDs) {
  try {
    let publicID = publicIDs.length > 0 ? publicIDs : false;
    console.log(publicID);
    if (publicID != false) {
      for (let i = 0; i < publicID.length; i++) {
        // const element = publicID[i];
        await cloudinary.v2.uploader.destroy(publicID[i]);
      }

      return { deleted: true };
    }
    return { error: 'no public Ids' };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

async function addpdf(file) {
  try {
    let files = file ? file : false;
    if (files != false && paths != false) {
      let upload = await cloudinary.v2.uploader.upload(files.tempFilePath, {
        resource_type: 'image',
        folder: process.env.notes,
        use_filename: false,
        unique_filename: true,
      });
      return { url: upload.secure_url, publicID: upload.public_id };
    }
    return { error: 'file not found' };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

module.exports = { uploadImg, deleteImg, deleteBulkImg, addpdf };
