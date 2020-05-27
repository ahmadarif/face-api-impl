import * as fs from 'fs';
import * as path from 'path';

export function saveFile(fileName: string, buf: Buffer) {
  fileName = path.resolve(fileName)
  const dir = path.dirname(fileName)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFileSync(fileName, buf)
  console.log(`File has created in ${fileName}`)
}