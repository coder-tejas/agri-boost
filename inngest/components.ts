  import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next"
import { useState } from "react"

export async function UploadImage (file:File) {
  const [progress, setProgress] = useState(0)
  const abortController = new AbortController()

  const authenticator = async () => {
    const response = await fetch("/api/upload-auth")
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Request failed with status ${response.status}: ${errorText}`)
    }
    return await response.json()
  }
  
  const uploadImage = async (file: File) => {
    if (!file) throw new Error("No file provided")

    let authParams
    try {
      authParams = await authenticator()
    } catch (err) {
      console.error("Authentication failed:", err)
      return
    }

    const { signature, expire, token, publicKey } = authParams

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (e) => setProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      })
      console.log("Upload response:", uploadResponse)
      return uploadResponse
    } catch (error) {
      if (error instanceof ImageKitAbortError) console.error("Upload aborted:", error.reason)
      else if (error instanceof ImageKitInvalidRequestError) console.error("Invalid request:", error.message)
      else if (error instanceof ImageKitUploadNetworkError) console.error("Network error:", error.message)
      else if (error instanceof ImageKitServerError) console.error("Server error:", error.message)
      else console.error("Upload error:", error)
    }
  }

  return null
}

