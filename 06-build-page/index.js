const fs = require('fs/promises');
const path = require('path');


const stylesSourceDirPath = 'styles';
const assetsSourceDirPath = 'assets';
const componentsSourceDirPath = 'components';
const indexTemplateSourceName = 'template.html';
const indexDestinationName = 'index.html';
const projectDestinationDirPath = 'project-dist';
const assetsDestinationDirPath = 'assets';
const stylesDestinationBundleName = 'style.css';
const fullStylesSourcePath = path.join(__dirname, stylesSourceDirPath);
const fullAssetsSourcePath = path.join(__dirname, assetsSourceDirPath);
const fullComponentsSourcePath = path.join(__dirname, componentsSourceDirPath);
const fullProjectDestinationPath = path.join(__dirname, projectDestinationDirPath);
const fullAssetsDestinationPath = path.join(fullProjectDestinationPath, assetsDestinationDirPath);

async function mergeStyles(sourcePath, destinationPath){
  // read diirectories
  const sourceFiles = await fs.readdir(sourcePath, {withFileTypes: true});
  const destFiles = await fs.readdir(destinationPath, {withFileTypes: false});

  // remove bundled css if exist
  if (destFiles.includes(stylesDestinationBundleName)) {
    await fs.rm(path.join(destinationPath, stylesDestinationBundleName));
    console.log(`-- ${stylesDestinationBundleName} deleted`);
  }
   
  // read content from css files
  let cssFilesContent = []; 
  for(let file of sourceFiles){
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const currentFileContentBuffer = await fs.readFile(path.join(fullStylesSourcePath, file.name));
      cssFilesContent.push(currentFileContentBuffer);
      console.log(`-- ${file.name} loaded`);
    }
  }
 
  // then write parts to bundle

  for(let dataChunck of cssFilesContent){
    await fs.appendFile(path.join(destinationPath, stylesDestinationBundleName), dataChunck);
  }  
}

async function copyDir(sourcePath, destinationPath){
  // todo rework for nested folders
  
  await fs.mkdir(
    destinationPath, 
    {recursive: true}
  );
  const sourceFiles = await fs.readdir(sourcePath, {withFileTypes: true});  // fs.Dirent
  const destFiles = await fs.readdir(destinationPath, {withFileTypes: false}); // only names
  let sourceNames =[];
  
  for(let file of sourceFiles) {
    const sourceFileWPath = path.join(sourcePath, file.name);
    const destFileWPath = path.join(destinationPath, file.name);
    sourceNames.push(file.name);
    if (file.isDirectory()) {
      await fs.mkdir(destFileWPath, {recursive: true});
      console.log(`-+ subdir "${file.name}" created`);
      await copyDir(sourceFileWPath, destFileWPath);
    }
    if (file.isFile()) {
      await fs.copyFile(sourceFileWPath,destFileWPath);
      console.log(`-- "/${file.name}" copied`);
    }
  }
  for(let file of destFiles) {
    if (!sourceNames.includes(file)) {
      await fs.rm(
        path.join(destinationPath, file), 
        {force: true, recursive: true}
      );
      console.log(`-- "/${file}" deleted`);
    }
  }
   
}

async function buildIndex() {

  // read template
  let template = await fs.readFile(
    path.join(__dirname, indexTemplateSourceName), 
    {encoding: 'utf-8'}
  );
  const destFiles = await fs.readdir(
    fullProjectDestinationPath, 
    {withFileTypes: false}
  );

  // read components
  const componentFiles = await fs.readdir(
    fullComponentsSourcePath, 
    {withFileTypes: true}
  );
  let componentsData = [];
  for (let compFile of componentFiles) {
    if (compFile.isFile() && 
        path.parse(compFile.name).ext === '.html') {
      let componentContent = {
        name: path.parse(compFile.name).name,
        data: await fs.readFile(
          path.join(fullComponentsSourcePath, compFile.name), 
          {encoding: 'utf-8'}
        ),
      };
      componentsData.push(componentContent);
      console.log(`-- component ${componentContent.name} loaded`);
    }
  }  
  
  // integrate components into template
  for (let component of componentsData) {
    template = template.replace(`{{${component.name}}}`, component.data);
  }

  // remove target index.html if exist
  if (destFiles.includes(indexDestinationName)) {
    await fs.rm(path.join(fullProjectDestinationPath, indexDestinationName));
  }
  // write template to index
  await fs.appendFile(path.join(fullProjectDestinationPath, indexDestinationName), template);
  console.log(`-- ${indexDestinationName} created`);

}

// -------------


(async () => {
  try {
    // mkdir
    await fs.mkdir(fullProjectDestinationPath, {recursive: true});

    // build index
    console.log('- Building index from template and components');
    await buildIndex();
    console.log('+ index built');
    
    // bundle styles
    console.log(`- Copying styles from "/${stylesSourceDirPath}" to "/${projectDestinationDirPath}"`);
    await mergeStyles(fullStylesSourcePath, fullProjectDestinationPath);
    console.log('+ styles copied');
    
    // copy assets
    console.log(`- Copying assets from "/${assetsSourceDirPath}" to "/${projectDestinationDirPath}/${assetsSourceDirPath}"`);
    await copyDir(fullAssetsSourcePath, fullAssetsDestinationPath);
    console.log('+ assets copied');
    
  } catch (err) {
    console.error('Error catched: ', err.errno, err.message);
  }
})();

