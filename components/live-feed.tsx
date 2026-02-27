"use client"

import { useState, useEffect, useRef } from "react"
import { Circle, Maximize2, Volume2, VolumeX, Settings, VideoOff, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LiveFeedProps {
  cameraId: string
  cameraName: string
  location: string
}

interface FaceBox {
  name: string
  status: "AUTHORIZED" | "UNAUTHORIZED"
  box: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export function LiveFeed({ cameraId, cameraName, location }: LiveFeedProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faces, setFaces] = useState<FaceBox[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // ===========================
  // CLOCK
  // ===========================
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString())
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // ===========================
  // START CAMERA
  // ===========================
  const startWebcam = async () => {
    try {
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setIsStreaming(true)
        }

        streamRef.current = stream
      }
    } catch (err) {
      console.error(err)
      setError("Unable to access camera")
    }
  }

  // ===========================
  // STOP CAMERA
  // ===========================
  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setFaces([])
    setIsStreaming(false)
  }

  // ===========================
  // AUDIO / FULLSCREEN
  // ===========================
  const toggleMute = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = isMuted))
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    videoRef.current?.requestFullscreen()
  }

  // ===========================
  // SEND FRAME TO BACKEND
  // ===========================
  const sendFrameToBackend = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx || video.videoWidth === 0) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const image = canvas.toDataURL("image/jpeg")

    try {
      const res = await fetch("http://localhost:8000/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      })

      const data = await res.json()
      setFaces(data.faces || [])
    } catch (e) {
      console.error("Recognition error", e)
    }
  }

  // ===========================
  // CALL BACKEND EVERY SECOND
  // ===========================
  useEffect(() => {
    if (!isStreaming) return
    const i = setInterval(sendFrameToBackend, 1000)
    return () => clearInterval(i)
  }, [isStreaming])

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Circle className={cn("w-2.5 h-2.5", isStreaming ? "fill-success" : "fill-muted")} />
          <span className="text-sm font-medium">{isStreaming ? "LIVE" : "OFFLINE"}</span>
          <span className="px-2 py-1 bg-muted rounded-md text-sm">{cameraId}</span>
        </div>

        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={isStreaming ? stopWebcam : startWebcam}>
            {isStreaming ? <VideoOff /> : <Video />}
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleMute} disabled={!isStreaming}>
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button size="icon" variant="ghost">
            <Settings />
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleFullscreen} disabled={!isStreaming}>
            <Maximize2 />
          </Button>
        </div>
      </div>

      {/* VIDEO */}
      <div className="relative aspect-video bg-muted">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas ref={canvasRef} className="hidden" />

        {/* BOUNDING BOXES */}
        {faces.map((face, i) => {
          const video = videoRef.current
          if (!video) return null

          const rect = video.getBoundingClientRect()
          const scaleX = rect.width / video.videoWidth
          const scaleY = rect.height / video.videoHeight

          return (
            <div
              key={i}
              className={cn(
                "absolute border-2 rounded-lg",
                face.status === "AUTHORIZED" ? "border-success" : "border-danger"
              )}
              style={{
                top: face.box.top * scaleY,
                left: face.box.left * scaleX,
                width: (face.box.right - face.box.left) * scaleX,
                height: (face.box.bottom - face.box.top) * scaleY,
              }}
            >
              <div
                className={cn(
                  "absolute -top-6 left-0 px-2 py-0.5 text-xs text-white rounded",
                  face.status === "AUTHORIZED" ? "bg-success" : "bg-danger"
                )}
              >
                {face.status === "AUTHORIZED" ? face.name : "UNAUTHORIZED"}
              </div>
            </div>
          )
        })}

        {/* FOOTER */}
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{cameraName}</h3>
              <p className="text-sm opacity-80">{location}</p>
            </div>
            <div className="text-right">
              <p className="font-mono">{currentTime}</p>
              <p className="text-xs opacity-80">{isStreaming ? "1080p • 30fps" : "No Signal"}</p>
            </div>
          </div>
        </div>

        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={startWebcam}>Start Live Feed</Button>
          </div>
        )}
      </div>
    </div>
  )
}
