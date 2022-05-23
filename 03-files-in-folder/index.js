const fs = require('fs');
const path = require('path');

const dirPath = 'secret-folder';
const fullPathName = path.join(__dirname, dirPath);

console.log(`Reading path : "${fullPathName}"...`);
console.log('────────────────────────────────────');
console.log('file name      -  ext    - file size');
console.log('────────────────────────────────────');

fs.readdir(fullPathName, {withFileTypes: true}, (err, filesData) => {
  if (err) {
    if (err.errno === -4058) {
      console.log(`=Failure= Path "${fullPathName}" does not exist. Aborting..`);
      process.exitCode = 1;
      process.exit();
    } 
    console.log(err.message);
    process.exitCode = 2;
    process.exit();
  }

  for (let file of filesData) {
    if (file.isFile()) {
      fs.stat(path.join(fullPathName, file.name), (err, stats) => {
        if (err) {
          console.log(err.message);
          process.exitCode = 3;
          process.exit();
        }
        const fileSizeStr = `${Math.trunc(stats.size / 1024 * 10)/10} kB`.padStart(8);
        console.log(
          path.parse(file.name).name
            .padEnd(13,' '),
          ' - ',
          path.parse(file.name).ext
            .substring(1)
            .padEnd(5,' '),
          ' - ', 
          fileSizeStr);
      });
    }
  }
});
  

