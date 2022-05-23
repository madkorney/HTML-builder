const fs = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');
const { pipeline } = require('stream');

const fileName = 'text.txt';
const filePathName = path.join(__dirname, fileName);
const readStream = fs.createReadStream(filePathName, 'utf-8');

pipeline(
  readStream,
  stdout,
  error => {
    if (error) {
      stderr.write(`Error: ${error.message}`);
    }
  }
);

