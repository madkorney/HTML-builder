const fs = require('fs');
const path = require('path');
const { stdin, stdout, stderr } = require('process');
const fileName = 'text.txt';
const filePathName = path.join(__dirname, fileName);
const writeStream = fs.createWriteStream(filePathName, 'utf-8');

process.on('SIGINT', () => {
  stdout.write(`input completed. file is written at : ${filePathName}\n`);
  writeStream.close();
  process.exit();
});

stdin.on('data', data => {
  if (data.toString().trim().toLowerCase().substring(0, 4) === 'exit') {
    stdout.write(`input completed. file is written at : ${filePathName}\n`);
    writeStream.close();
    process.exit();
  }
  writeStream.write(data);
});

writeStream.on('error', error => stderr.write(`Error: ${error.message}`));
stdin.on('error', error => stderr.write(`Error: ${error.message}`));

console.log('Please type some text to be written to file. For exit type "exit" or press Ctrl-C.');

