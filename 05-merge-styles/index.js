const fs = require('fs/promises');
const path = require('path');


const sourceDirPath = 'styles';
const destinationDirPath = 'project-dist';
const destinationBundleName = 'bundle.css';
const fullSourcePath = path.join(__dirname, sourceDirPath);
const fullDestinationPath = path.join(__dirname, destinationDirPath);

async function mergeStyles(sourcePath, destinationPath){
  // read diirectories
  const sourceFiles = await fs.readdir(sourcePath, {withFileTypes: true});
  const destFiles = await fs.readdir(destinationPath, {withFileTypes: false});

  // remove bundle.css if exist
  if (destFiles.includes(destinationBundleName)) {
    await fs.rm(path.join(destinationPath, destinationBundleName));
    console.log(`${destinationBundleName} deleted.`);
  }
   
  // read content from css files
  let cssFilesContent = []; 
  for(let file of sourceFiles){
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const currentFileContentBuffer = await fs.readFile(path.join(fullSourcePath, file.name));
      cssFilesContent.push(currentFileContentBuffer);
      console.log(`${file.name} loaded`);
    }
  }
 
  // then write parts to bundle
  let index = 0;
  for(let dataChunck of cssFilesContent){
    await fs.appendFile(path.join(fullDestinationPath, destinationBundleName), dataChunck);
    console.log(`part ${index} added to bundle`);
    index += 1;
  }  
  // cssFilesContent.forEach(async (part, index) => {
  //   await fs.appendFile(path.join(fullDestinationPath, destinationBundleName), part);
  //   console.log(`part ${index} added to bundle`);
  // });
}

// -------------
console.log(`Copying styles from "/${sourceDirPath}/" to "/${destinationDirPath}/"`);
(async () => {
  try {
    await mergeStyles(fullSourcePath, fullDestinationPath);
  } catch (err) {
    console.error(err);
  }
})();
