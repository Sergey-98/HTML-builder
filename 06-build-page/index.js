const fs = require('fs');
const path = require('path');

async function createDir(folderDist) {
  await fs.promises.rm(folderDist, {recursive: true, force: true});
  await fs.promises.mkdir(folderDist, {recursive: true});
}

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

async function createHtml(components) {
  const readFileTemplates = new fs.ReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  let fileComponents = await fs.promises.readdir(components, {withFileTypes: true});
  let data = '';
  readFileTemplates.on('data', chunk => data += chunk);
  readFileTemplates.on('end', async () => {
    fileComponents.forEach(file => { 
      if (file.isFile() === true) {
        const readFile = new fs.ReadStream(path.join(__dirname, 'components', file.name), 'utf-8');
        const fileName = file.name.split('.')[0];
        let compData = '';
        readFile.on('data', chunk => compData += chunk);
        readFile.on('end', () => {
          data = data.replace(`{{${fileName}}}`, compData);
          const streamHtml = new fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
          streamHtml.write(data);
        });
      }
    });
  });
}

async function createCss(styles) {
  const streamCss = new fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

  fs.readdir(styles, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log(err);
    }
    files.forEach((file) => {
      let folderFile = path.join(styles, file.name);
      if (file.isFile() && path.extname(folderFile) === '.css') {
        const arr = [];
        let readFile = new fs.ReadStream(folderFile, 'utf-8');
        readFile.on('data', chunk => arr.push(chunk));
        readFile.on('end', () => arr.forEach(elem => streamCss.write(`${elem}\n`)));
      }
    });
  });
}

async function createProject() {
  await createDir(path.join(__dirname, 'project-dist'));
  await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  await createHtml(path.join(__dirname, 'components'));
  await createCss(path.join(__dirname, 'styles'));
}

createProject();