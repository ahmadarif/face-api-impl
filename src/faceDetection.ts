import * as faceapi from 'face-api.js';
import { join } from 'path';
import { canvas, saveFile } from './commons';

async function run() {
  await faceapi.nets.tinyFaceDetector.loadFromDisk(join(__dirname, '..', 'models'))

  console.time('process')
  const img = await canvas.loadImage(join(__dirname, '..', 'images/bbt2.jpg'))
  const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
  console.timeEnd('process')

  const out = faceapi.createCanvasFromMedia(img) as any
  faceapi.draw.drawDetections(out, detections)

  saveFile(__dirname + '/../out/faceDetection.jpg', out.toBuffer('image/jpeg'))
}

run()