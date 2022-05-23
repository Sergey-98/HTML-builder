const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface(process.stdin, process.stdout);
rl.write('Hello, press your message, please: \n');
rl.on('line', (inp) => {
  if (inp === 'exit') {
    rl.write('\nThank you for your message!');
    process.exit();
  }
  let final = inp + '\n';
  stream.write(final);
});

rl.on('close', () => {
  rl.write('\nThank you for your message!');
  process.exit();
});