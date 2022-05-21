const fs = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');
const { pipeline } = require('stream');


const fileName = 'text.txt';
const filePathName = path.join(__dirname, fileName);
const readStream = fs.createReadStream(filePathName, 'utf-8');

// without pipeline it would be
// let fileData = '';
// readStream.on('data', chunk => {fileData += chunk;});
// readStream.on('end', () => {stdout.write(fileData);});
//   or 
// readStream.on('data', chunk => {stdout.write(chunk);});
//
// readStream.on('error', error => stderr.write(`Error: ${error.message}`));

pipeline(
  readStream,
  stdout,
  error => {
    if (error) {
      stderr.write(`Error: ${error.message}`);
    }
  }
);

