import * as faceapi from 'face-api.js';
import { join } from 'path';
import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';


const REFERENCE_IMAGE = join(__dirname, '..', 'images/bbt1.jpg')
const QUERY_IMAGE = join(__dirname, '..', 'images/bbt4.jpg');

async function run() {
  await faceDetectionNet.loadFromDisk(join(__dirname, '..', 'models'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(join(__dirname, '..', 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(join(__dirname, '..', 'models'))

  const referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
  const queryImage = await canvas.loadImage(QUERY_IMAGE)

  const resultsRef = await faceapi.detectAllFaces(referenceImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()

  const resultsQuery = await faceapi.detectAllFaces(queryImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()

  const faceMatcher = new faceapi.FaceMatcher(resultsRef)

  const labels = faceMatcher.labeledDescriptors
    .map(ld => ld.label)
  const refDrawBoxes = resultsRef
    .map(res => res.detection.box)
    .map((box, i) => new faceapi.draw.DrawBox(box, { label: labels[i] }))
  const outRef = faceapi.createCanvasFromMedia(referenceImage)
  refDrawBoxes.forEach(drawBox => drawBox.draw(outRef))

  saveFile(__dirname + '/../out/referenceImage.jpg', (outRef as any).toBuffer('image/jpeg'))

  const queryDrawBoxes = resultsQuery.map(res => {
    const bestMatch = faceMatcher.findBestMatch(res.descriptor)
    return new faceapi.draw.DrawBox(res.detection.box, { label: bestMatch.toString() })
  })
  const outQuery = faceapi.createCanvasFromMedia(queryImage)
  queryDrawBoxes.forEach(drawBox => drawBox.draw(outQuery))
  saveFile(__dirname + '/../out/queryImage.jpg', (outQuery as any).toBuffer('image/jpeg'))
}

run()