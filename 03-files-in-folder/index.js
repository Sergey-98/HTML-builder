const fs = require('fs');
const path = require('path');

const route = path.join(__dirname, 'secret-folder');

fs.readdir(route, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach(file => { 
    if (file.isFile() === true) {
      let folderFile = path.join(route, file.name);
      fs.stat(folderFile, (err, stats) => {
        if (err) {
          console.log(err);
        }
        let name = file.name.split('.')[0];
        let extension = path.extname(folderFile);
        let size = `${(stats.size/1024).toFixed(3)}kb`;
        console.log(`${name} - ${extension} - ${size}`);
      });
    }
  });
});