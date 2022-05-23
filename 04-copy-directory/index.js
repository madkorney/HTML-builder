const fs = require('fs/promises');
const path = require('path');

const sourceDirPath = 'files';
const destinationDirPath = 'files-copy';
const fullSourcePath = path.join(__dirname, sourceDirPath);
const fullDestinationPath = path.join(__dirname, destinationDirPath);

async function copyDir(sourcePath, destinationPath){
  await fs.mkdir(destinationPath, {recursive: true});
  const sourceFiles = await fs.readdir(sourcePath, {withFileTypes: false});
  const destFiles = await fs.readdir(destinationPath, {withFileTypes: false});
  
  for (let file of destFiles) {
    if (!sourceFiles.includes(file)) {
      await fs.rm(path.join(destinationPath, file));
      console.log(`${file} deleted`);
    }
  }
  
  for (let file of sourceFiles){
    const overwritten = destFiles.includes(file);
    await fs.copyFile(
      path.join(sourcePath, file),
      path.join(destinationPath, file)
    );
    console.log(`${file} ${overwritten ? 'overwritten' : 'copied'}.`);
  }
}

// -------------
console.log(`Copying from "/${sourceDirPath}" to "/${destinationDirPath}"`);
(async () => {
  try {
    await copyDir(fullSourcePath, fullDestinationPath);
  } catch (err) {
    console.error(err);
  }
})();
