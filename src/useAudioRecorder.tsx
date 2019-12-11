import { useRef, useState, useEffect } from 'react'

export type Audio = {
  url: string
  extension: string
}

const constraints = {
  audio: true,
  video: false,
}

type UseMediaRecorderReturnType = {
  durationSeconds: number
  recordingState: RecordingState
  start: () => void
  stop: () => Promise<Audio>
}

type RecordingState = 'recording' | 'not_recording'

export function useAudioRecorder(): UseMediaRecorderReturnType {
  const [recordingState, setRecordingState] = useState<RecordingState>('not_recording')
  const mediaRecorderRef = useRef<MediaRecorder | undefined>(undefined)
  const [durationSeconds, setDurationSeconds] = useState<number>(0)
  const intervalIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (recordingState === 'recording') {
      intervalIdRef.current = window.setInterval(() => {
        setDurationSeconds((prev) => {
          return (prev += 1)
        })
      }, 1000)
    }

    if (recordingState === 'not_recording' && intervalIdRef.current != undefined) {
      window.clearInterval(intervalIdRef.current)
      intervalIdRef.current = undefined
    }

    return () => {
      if (intervalIdRef.current != undefined) {
        window.clearInterval(intervalIdRef.current)
      }
    }
  }, [recordingState])

  function start(): void {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start()

      setRecordingState('recording')
      setDurationSeconds(0)
    })
  }

  function stop(): Promise<Audio> {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current

      if (mediaRecorder == undefined) {
        return reject('Error')
      }

      mediaRecorder.onstop = () => {
        setRecordingState('not_recording')
      }

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        const audioSrc = URL.createObjectURL(e.data)

        resolve({
          url: audioSrc,
          extension: 'ogg',
        })
      }

      mediaRecorder.stop()
    })
  }

  return {
    durationSeconds,
    recordingState,
    start,
    stop,
  }
}
