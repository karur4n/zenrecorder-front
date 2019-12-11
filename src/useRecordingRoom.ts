import React from 'react'
import { Room } from './domain/Room'

type ConnectingStatus = 'pending' | 'connected' | 'failed' | 'closed'

export function useRecordingRoom(roomId: string) {
  const socketRef = React.useRef<WebSocket | undefined>(undefined)
  const [connectingStatus, setConnectingStatus] = React.useState<ConnectingStatus>('pending')
  const [userId, setUserId] = React.useState<string | undefined>(undefined)
  const [room, setRoom] = React.useState<Room | undefined>(undefined)

  //
  // Effects
  //
  React.useEffect(() => {
    const socket = socketRef.current

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [roomId])

  //
  // Functions
  //
  function joinRoom(userName: string): void {
    setConnectingStatus('pending')

    const socket = new WebSocket('wss://8mre732jfk.execute-api.ap-northeast-1.amazonaws.com/production')

    socketRef.current = socket

    socket.onopen = () => {
      setConnectingStatus('connected')

      const body = JSON.stringify({
        action: 'sendMessage',
        type: 'JOIN_ROOM',
        payload: {
          roomId: roomId,
          userName: userName,
        },
      })

      socket.send(body)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setRoom({
        ...data,
        recordingStartedAt: new Date(data.recordingStartedAt),
      })
    }

    socket.onerror = () => {
      setConnectingStatus('failed')
    }

    socket.onclose = () => {
      setConnectingStatus('closed')
    }
  }

  function send(body: object): void {
    const socket = socketRef.current

    console.log('socket', socket)

    if (socket) {
      socket.send(
        JSON.stringify({
          action: 'sendMessage',
          ...body,
        })
      )
    }
  }

  function reset() {}

  return {
    room,
    joinRoom,
    connectingStatus,
    send,
  }
}
