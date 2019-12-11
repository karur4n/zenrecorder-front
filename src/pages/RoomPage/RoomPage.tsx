import React, { useState } from 'react'
import ReactModal from 'react-modal'
import { differenceInSeconds } from 'date-fns'
import styled from 'styled-components'
import { useRecordingRoom } from '../../useRecordingRoom'
import { useAudioPermission } from '../../useAudioPermission'
import { AudioPermissionModal } from '../AudioPermissionModal'
import { useAudioRecorder, Audio } from '../../useAudioRecorder'
import { usePrevious } from '../../usePrevious'
import { formatSecondsToDurationString } from '../../utils/formatSeconds'
import { AudioComponent } from './components/AudioComponent'

function getRoomIdByUrl(url: string): string | undefined {
  const ROOM_ID_PATTERN = /\/rooms\/([a-zA-Z0-9\-]+)\/?$/

  const found = url.match(ROOM_ID_PATTERN)

  return found != undefined ? found[1] : undefined
}

export const RoomPage: React.FC = () => {
  const roomId = getRoomIdByUrl(window.location.href)

  if (roomId == undefined) {
    return null
  }

  const [audios, setAudios] = useState<Audio[]>([])
  const { isAudioPermitted, requestAudioPermission } = useAudioPermission()
  const { start, stop, durationSeconds, recordingState } = useAudioRecorder()
  const { connectingStatus, room, send, joinRoom } = useRecordingRoom(roomId)
  const [recordingStartTimer, setRecordingStartTimer] = useState<number | undefined>(undefined)
  const [isAudioComponentModalOpen, setIsAudioComponentModalOpen] = useState<boolean>(false)

  const prevRoom = usePrevious(room)

  const isRecording = React.useMemo(() => {
    if (room == undefined) {
      return false
    }

    console.log(777, recordingState)

    return room.status === 'recording' && recordingState === 'recording'
  }, [room, recordingState])

  React.useEffect(() => {
    requestAudioPermission()
  }, [])

  React.useEffect(() => {
    if (isAudioPermitted) {
      joinRoom('古河和樹')
    }
  }, [isAudioPermitted])

  React.useEffect(() => {
    if (connectingStatus === 'failed') {
      throw new Error()
    }
  }, [connectingStatus])

  React.useEffect(() => {
    console.log(room)

    const 入室したら収録中だった = prevRoom == undefined && room && room.status === 'recording'
    const 入室してから収録中になった =
      prevRoom != undefined && room != undefined && prevRoom.status == 'beforeRecording' && room.status === 'recording'

    console.log(入室したら収録中だった || 入室してから収録中になった)

    if (入室したら収録中だった || 入室してから収録中になった) {
      requestRecordingStart(room!.recordingStartedAt)
    }

    if (prevRoom != undefined && prevRoom.status !== 'completed' && room != undefined && room.status === 'completed') {
      stop()
        .then((audio) => {
          console.log('Audio', audio)
          setAudios((prev) => [...prev, audio])
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }, [room])

  React.useEffect(() => {
    if (recordingStartTimer == undefined) {
      return
    }

    if (recordingStartTimer === 0) {
      start()
    }
  }, [recordingStartTimer])

  React.useEffect(() => {
    if (audios.length > 0) {
      setIsAudioComponentModalOpen(true)
    }
  }, [audios])

  //
  // functions
  //
  function requestRecordingStart(startedAt: Date): void {
    let intervalId: number | undefined = undefined

    intervalId = setInterval(() => {
      const current = new Date()

      if (current > startedAt) {
        clear()
        return
      }

      const diffInSec = Math.abs(differenceInSeconds(current, startedAt))

      setRecordingStartTimer(diffInSec)
    }, 100)

    function clear() {
      if (intervalId != undefined) {
        clearInterval(intervalId)
      }
    }
  }

  //
  // handler
  //
  const onRecordingStartRequest = () => {
    send({
      type: 'START_RECORDING',
      payload: {
        roomId: roomId,
      },
    })
  }

  const onRecordingStopRequest = () => {
    send({
      type: 'COMPLETE_RECORDING',
      payload: {
        roomId: roomId,
      },
    })
  }

  const onRequestAudioModalClose = () => {
    const result = window.confirm('閉じてもよろしいですか？')

    if (result) {
      setIsAudioComponentModalOpen(false)
    }
  }

  //
  // render
  //
  return (
    <>
      <ReactModal
        isOpen={isAudioComponentModalOpen}
        shouldCloseOnOverlayClick={false}
        onRequestClose={onRequestAudioModalClose}
      >
        <div className="relative">
          <p className="text-xl font-bold mb-4">収録した音声</p>
          {audios.map((audio) => (
            <div key={audio.url}>
              <AudioComponent src={audio.url} controls />
            </div>
          ))}
          <div
            className="absolute text-xl cursor-pointer hover:text-blue-700"
            style={{ top: '-14px', right: '-6px' }}
            onClick={onRequestAudioModalClose}
          >
            ×
          </div>
        </div>
      </ReactModal>
      <Container>
        <div style={{ gridArea: 'header' }}>
          <header
            className="h-full flex items-center px-4"
            style={{
              backgroundImage:
                'radial-gradient( circle farthest-corner at 12.3% 19.3%,  rgba(85,88,218,1) 0%, rgba(95,209,249,1) 100.2% )',
            }}
          >
            <h1 className="font-bold text-white">ZenRecorder</h1>
          </header>
        </div>
        <div style={{ gridArea: 'content', padding: '0 16px' }}>
          {room && (
            <div>
              {room.users.map((user) => (
                <UserRow key={user.id}>{user.name}</UserRow>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex justify-between items-center px-4"
          style={{
            gridArea: 'operation',
            boxShadow: '0px 10px 40px -10px rgba(0,64,128,0.2)',
          }}
        >
          <RecordButton
            isRecording={isRecording}
            startCountTimer={recordingStartTimer}
            onStartRecordingRequest={onRecordingStartRequest}
            onStopRecordingRequest={onRecordingStopRequest}
          />
          {formatSecondsToDurationString(durationSeconds)}
        </div>
      </Container>
      <AudioPermissionModal isOpen={!isAudioPermitted} />
    </>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 48px 1fr 80px;
  grid-template-areas: 'header' 'content' 'operation';
  height: 100vh;
`

type RecordButtonProps = {
  isRecording: boolean
  startCountTimer?: number
  onStartRecordingRequest: () => void
  onStopRecordingRequest: () => void
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  startCountTimer,
  onStartRecordingRequest,
  onStopRecordingRequest,
}) => {
  if (startCountTimer) {
    return <p>{startCountTimer}</p>
  }

  if (isRecording) {
    return <div className="bg-gray-600 w-8 h-8" onClick={onStopRecordingRequest} />
  } else {
    return <div className="bg-red-600 w-8 h-8 rounded-full" onClick={onStartRecordingRequest} />
  }
}

const UserRow = styled.div`
  padding: 4px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`
