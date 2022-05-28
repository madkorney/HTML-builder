const fs = require('fs/promises');
const path = require('path');

function getBasename(fileName) {
  return path.parse(fileName).name;
} 

function getExtension(fileName) {
  return path.parse(fileName).ext.slice(1);
}

function getFileSize(fileStats) {
  return fileStats.size;
}

function formatBasename(basename) {
  const output  = basename.padEnd(13,' ');
  return output;
}

function formatExtension(extension) {
  const output  = extension.padEnd(7,' ');
  return output;
}

function formatSize(fileSize) {
  const output = `${Math.trunc(fileSize / 1024 * 10)/10} KiB`.padStart(8);
  return output;
}

async function readDirectory() {
  const pathToDir = 'secret-folder';
  const fullPathToDir = path.join(__dirname, pathToDir);

  function printHeader(fullPathToDir){
    console.log(`Reading path : "${fullPathToDir}"...`);
    console.log('────────────────────────────────────');
    console.log('file name      - ext     - file size');
    console.log('────────────────────────────────────');
  }

  try {
    printHeader(fullPathToDir);

    const dirContentList = await fs.readdir(fullPathToDir, {withFileTypes: true});
    
    for (const item of dirContentList) {
      if (item.isFile()) {
        const pathToFile = path.join(fullPathToDir, item.name);
        const fileStats  = await fs.stat(pathToFile);

        const basename = formatBasename(getBasename(item.name));
        const extension = formatExtension(getExtension(item.name));
        const fileSize = formatSize(getFileSize(fileStats));
        console.log(`${basename}  - ${extension} - ${fileSize}`);
      }
    }

    
  } catch (err) {
    if (err.errno === -4058) {
      console.log(`=Failure= Path "${fullPathToDir}" does not exist. Aborting..`);
      process.exit(1);
    } 
    console.log(err.message);
    process.exit(2);
  }
}  


(async () => {
  await readDirectory();  
})();