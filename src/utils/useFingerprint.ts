import FingerprintJS from '@fingerprintjs/fingerprintjs'

// 获取浏览器唯一指纹
export async function getBrowserFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}
