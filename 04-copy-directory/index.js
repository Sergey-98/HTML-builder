const fs = require('fs');
const path = require('path');

async function copyDir(folder, route) {
  await fs.promises.rm(route, {recursive: true, force: true});
  await fs.promises.mkdir(route, {recursive: true});
  let files = await fs.promises.readdir(folder, {withFileTypes: true});
  
  for (let i = 0; i < files.length; i++) {
    let folderFile = path.join(folder, files[i].name);
    let folderFileCopy = path.join(route, files[i].name);
    if (files[i].isDirectory()) {
      await copyDir(folderFile, folderFileCopy);
    } else {
      await fs.promises.copyFile(folderFile, folderFileCopy);
    }
  }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));