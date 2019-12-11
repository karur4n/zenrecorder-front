import React from 'react'
import axios from 'axios'

export const IndexPage = () => {
  const onClick = () => {
    createRoom()
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClick}>
        ルームを作成する
      </button>
    </div>
  )
}

async function createRoom(): Promise<void> {
  const BASE_URL = 'https://5bxfoweku9.execute-api.ap-northeast-1.amazonaws.com/production'

  try {
    const response = await axios.post<{ roomId: string }>(BASE_URL + '/create-room')

    const roomId = response.data.roomId

    window.location.href = `/rooms/${roomId}`
  } catch (e) {
    console.log(e)
  }
}
