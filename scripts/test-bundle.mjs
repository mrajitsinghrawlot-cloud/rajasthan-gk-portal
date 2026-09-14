import fs from 'fs';
import path from 'path';

const distDir = './dist/assets';
const files = fs.readdirSync(distDir);
const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
if (jsFile) {
  const code = fs.readFileSync(path.join(distDir, jsFile), 'utf8');
  console.log('JS file:', jsFile, 'Size:', code.length);
  console.log('Includes A.01.01:', code.includes('A.01.01'));
  console.log('Includes A.01.02:', code.includes('A.01.02'));
  console.log('Includes B.01.01:', code.includes('B.01.01'));
  console.log('Includes A.04.02:', code.includes('A.04.02'));
}
