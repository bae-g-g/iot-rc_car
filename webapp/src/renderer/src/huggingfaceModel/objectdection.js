import * as ort from 'onnxruntime-web'

ort.env.wasm.numThreads = 1
ort.env.wasm.simd = false
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/'

// --- 추가 1: 객체 이름 리스트 (YOLOv10 기본) ---
const COCO_CLASSES = [
  'person',
  'bicycle',
  'car',
  'motorcycle',
  'airplane',
  'bus',
  'train',
  'truck',
  'boat',
  'traffic light'
]
// 필요시 더 추가 가능합니다.

export async function loadModel() {
  try {
    const modelPath = '/model/yolov10n.onnx'
    const session = await ort.InferenceSession.create(modelPath, { executionProviders: ['wasm'] })
    console.log('모델 로드 성공!')
    return session
  } catch (e) {
    console.error('모델 로드 중 에러 발생:', e)
    return null
  }
}

// --- 추가 2: 그림 그려서 Base64로 만드는 함수 ---
async function drawAndGetBase64(blob, outputArray) {
  const imageBitmap = await window.createImageBitmap(blob)
  const canvas = new window.OffscreenCanvas(640, 640)
  const ctx = canvas.getContext('2d')

  // 1. 배경 이미지 그리기
  ctx.drawImage(imageBitmap, 0, 0, 640, 640)

  // 2. 박스 설정
  ctx.strokeStyle = '#00FF00' // 녹색 박스
  ctx.lineWidth = 3
  ctx.fillStyle = '#00FF00'
  ctx.font = 'bold 16px Arial'

  // 3. 결과 데이터(outputArray) 반복하며 그리기
  for (let i = 0; i < outputArray.length; i += 6) {
    const [x1, y1, x2, y2, score, classId] = outputArray.slice(i, i + 6)
    if (score > 0.4) {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
      const label = `${COCO_CLASSES[classId] || classId}: ${Math.round(score * 100)}%`
      ctx.fillText(label, x1, y1 > 20 ? y1 - 5 : 10)
    }
  }

  // 4. Base64로 변환
  const resultBlob = await canvas.convertToBlob({ type: 'image/jpeg' })
  return new Promise((res) => {
    const reader = new FileReader()
    reader.onloadend = () => res(reader.result)
    reader.readAsDataURL(resultBlob)
  })
}

async function blobToFloat32Array(blob, width, height) {
  const imageBitmap = await createImageBitmap(blob)
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imageBitmap, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height).data
  const result = new Float32Array(3 * width * height)

  for (let i = 0; i < width * height; i++) {
    result[i] = imageData[i * 4] / 255.0
    result[i + width * height] = imageData[i * 4 + 1] / 255.0
    result[i + 2 * width * height] = imageData[i * 4 + 2] / 255.0
  }
  return result
}

export async function objectDection(inputData) {
  const session = await loadModel()
  if (!session) return

  try {
    const float32Data = await blobToFloat32Array(inputData, 640, 640)
    const inputTensor = new ort.Tensor('float32', float32Data, [1, 3, 640, 640])
    const feeds = { [session.inputNames[0]]: inputTensor }
    const results = await session.run(feeds)

    // --- 수정 부분: 결과 데이터를 그림으로 그리기 ---
    const outputData = results[session.outputNames[0]].data
    const base64Image = await drawAndGetBase64(inputData, outputData)

    console.log('추론 및 이미지 생성 완료', base64Image)
    return base64Image // 이제 박스 쳐진 이미지를 반환합니다!
  } catch (e) {
    console.error('추론 중 에러 발생:', e)
  }
}
