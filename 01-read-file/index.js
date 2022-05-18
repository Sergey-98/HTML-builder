const fs = require('fs');
const path = require('path');
const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'));
let data = '';
stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));