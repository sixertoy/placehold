const path = require('path');
const sizeOf = require('image-size');

const uploadfolder = 'upload';
const uploadpath = path.join(__dirname, uploadfolder);

const uploadFile = (req, res) => {
  if (!req.files) return res.status(400).send('Unable to upload files, missing parameters');
  const timestamp = Date.now();
  const fieldname = req.params[0] || 'file';
  const fileobject = req.files[fieldname];
  const fileextension = path.extname(fileobject.name);
  const outputfilename = `image_${timestamp}${fileextension}`;
  const outputpath = path.join(uploadpath, outputfilename);
  fileobject.mv(outputpath, (err) => {
    if (err) return res.status(500).send(err);
    const dimensions = sizeOf(outputpath);
    const result = {
      dimensions,
      root: `${uploadpath}`,
      filename: outputfilename,
      uri: `/${uploadfolder}/${outputfilename}`,
      path: `${uploadpath}${path.sep}${outputfilename}`,
    };
    res.send(result);
  });
};

module.exports = uploadFile;
