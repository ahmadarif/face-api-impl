import * as faceapi from 'face-api.js';
import { join } from 'path';
import { canvas, saveFile } from './commons';

async function run() {
  await faceapi.nets.tinyFaceDetector.loadFromDisk(join(__dirname, '..', 'models'))
  await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(join(__dirname, '..', 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(join(__dirname, '..', 'models'))

  console.time('process')
  const img = await canvas.loadImage(join(__dirname, '..', 'images/bbt4.jpg'))
  const results = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3, inputSize: 640 })).withFaceLandmarks(true).withFaceDescriptors()
  console.timeEnd('process')

  const out = faceapi.createCanvasFromMedia(img) as any
  faceapi.draw.drawDetections(out, results.map(res => res.detection))
  faceapi.draw.drawFaceLandmarks(out, results.map(res => res.landmarks))

  console.log(results[0].descriptor)

  saveFile(__dirname + '/../out/faceLandmarkDetection.jpg', out.toBuffer('image/jpeg'))
}

run()