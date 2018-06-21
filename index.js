const path = require('path');
const cors = require('cors');
const express = require('express');
const sizeOf = require('image-size');
const fileUpload = require('express-fileupload');

const app = express();

// middlewares
app.use(cors());
app.use(fileUpload());

const port = 2900;
const uploadfolder = 'upload';
const serveruri = `http://localhost:${port}`;
const uploadpath = path.join(__dirname, uploadfolder);

app.use(express.static(__dirname));

app.post('/upload', (req, res) => {
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
      path: `${uploadpath}${path.sep}${outputfilename}`,
      uri: `${serveruri}/${uploadfolder}/${outputfilename}`,
    };
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Placehold server running on port ${serveruri}`);
});
