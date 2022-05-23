const fs = require('fs');
const path = require('path');

const stream = path.join(__dirname, 'project-dist');
const streamWrite = fs.createWriteStream(path.join(stream, 'bundle.css'));
const styles = path.join(__dirname, 'styles');

fs.readdir(styles, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach((file) => {
    let folderFile = path.join(styles, file.name);
    if (file.isFile() && path.extname(folderFile) === '.css') {
      const arr = [];
      let readFile = fs.createReadStream(folderFile, 'utf-8');
      readFile.on('data', chunk => arr.push(chunk));
      readFile.on('end', () => arr.forEach(elem => streamWrite.write(`${elem}\n`)));
    }
  });
});
