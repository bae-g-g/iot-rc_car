import { InferenceClient } from '@huggingface/inference'
import { Buffer } from 'buffer'
// import dotenv from 'dotenv';

// dotenv.config()
window.Buffer = Buffer

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN
const hf = new InferenceClient(HF_TOKEN)

function base64ToBlob(base64, mimeType = 'image/png') {
  try {
    // 1. Decode the Base64 string (removes the Data URL prefix if present)
    const byteString = atob(base64.split(',')[1] || base64)

    // 2. Create an ArrayBuffer and a Uint8Array
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    // 3. Fill the Uint8Array with the decoded characters
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    // 4. Return the Blob object
    return new Blob([ab], { type: mimeType })
  } catch (error) {
    console.error('에러 발생:', error)
    return error
  }
}

async function upscaleImage(base64) {
  try {
    const imageBlob = base64ToBlob(base64)
    console.log('모델 추론 시작... (시간이 다소 걸릴 수 있습니다)', imageBlob)
    // 3. API 호출
    const result = await hf.imageToImage({
      model: 'valiantcat/Qwen-Image-Edit-2509-Upscale2K', // 사용할 모델 ID
      inputs: imageBlob,
      parameters: {
        prompt: 'Upscale this picture to 4K resolution.'
      }
    })

    const buffer = window.Buffer.from(await result.arrayBuffer())
    const blob = new Blob([buffer], { type: 'image/png' })
    console.log('성공! upscaled')
    return blob
  } catch (error) {
    console.error('에러 발생:', error)
    return error
  }
}

export { upscaleImage }

// import testImage from '../assets/test.png'

// async function upscaleImage_Test(imageBlob) {
//   try {
//     const response = await fetch(testImage)
//     const imageBlob2 = await response.blob()

//     const prompt = 'Upscale this picture to 4K resolution.'
//     console.log('모델 추론 시작... (시간이 다소 걸릴 수 있습니다)', imageBlob2)
//     // 3. API 호출
//     const result = await hf.imageToImage({
//       model: 'valiantcat/Qwen-Image-Edit-2509-Upscale2K', // 사용할 모델 ID
//       inputs: imageBlob2,
//       parameters: {
//         prompt: prompt
//       }
//     })

//     // 4. 결과 저장 (Blob -> Buffer -> 파일 저장)
//     const buffer = window.Buffer.from(await result.arrayBuffer())
//     const blob = new Blob([buffer], { type: 'image/png' })

//     console.log('성공! upscaled')

//     // 기존 코드 내 성공 로그 아래에 추가하면 됩니다.
//     const reader = new FileReader()
//     reader.readAsDataURL(blob)
//     reader.onloadend = () => {
//       const base64String = reader.result
//       console.log('Base64 변환 결과:', base64String) // 여기서 긴 문자열을 확인 가능합니다.
//     }

//     return blob
//   } catch (error) {
//     console.error('에러 발생:', error)
//     return imageBlob
//   }
// }

// export { upscaleImage_Test }
