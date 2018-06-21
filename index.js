const path = require('path');
const cors = require('cors');
const { argv } = require('yargs');
const express = require('express');
const lookuproot = require('lookuproot');
const fileUpload = require('express-fileupload');

// application
const has = require('./src/has');

// default port defined to 2900 in placehold/.env file
let port = (has(argv, 'port') && typeof argv.port === 'number' && argv.port) || null;

if (!port) {
  try {
    /* -----------------------------------

    Looking for a package.json file
    In the current command path

    ----------------------------------- */
    let pkg = path.join(process.cwd(), 'package.json');
    // eslint-disable-next-line global-require, import/no-dynamic-require
    pkg = require(pkg);
    if (!has(pkg, 'placehold')) {
      throw new Error('No property `placehold` in current package.json');
    }
    port = pkg.placehold;
  } catch (e) {
    /* -----------------------------------

    Looking for an .env file
    In the current command path

    ----------------------------------- */
    // check .env file project > user's home > module directory
    const envfile = lookuproot('.env');
    // eslint-disable-next-line global-require
    require('dotenv').config({ path: envfile });
    port = process.env.PLACEHOLD_PORT;
  }
}

const app = express();
app.use(cors());
app.use(fileUpload());

const serveruri = `http://localhost:${port}`;
const dummyRouteRegex = new RegExp(/\/(\d+)(?:x((\d+)))?(.\w+)?/);

app.use(express.static(__dirname));
app.post('/upload', require('./src/upload-file'));
app.get(dummyRouteRegex, require('./src/dummy-image'));

app.listen(port, () => {
  process.stdout.write(`Placehold server running on port ${serveruri}`);
});
