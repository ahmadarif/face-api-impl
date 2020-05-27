import * as fs from 'fs';
import * as path from 'path';

export function saveFile(fileName: string, buf: Buffer) {
  const dir = path.dirname(fileName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(fileName, buf)
}