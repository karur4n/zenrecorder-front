import React from 'react'

const constraints = {
  audio: true,
  video: false,
}

export function useAudioPermission() {
  const [isAudioPermitted, setIsAudioPermitted] = React.useState<boolean>(false)

  //
  // functions
  //
  const requestAudioPermission = () => {
    navigator.permissions
      .query({ name: 'microphone' })
      .then((status) => {
        if (status.state === 'prompt') {
          promptAudioPermission()
        } else {
          setIsAudioPermitted(isPermitted(status.state))
        }

        status.onchange = () => {
          if (status.state === 'prompt') {
            promptAudioPermission()
          } else {
            setIsAudioPermitted(isPermitted(status.state))
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  function promptAudioPermission() {
    navigator.mediaDevices.getUserMedia(constraints).catch(() => {
      console.log('denied')
    })
  }

  const isPermitted = (state: PermissionState): boolean => state === 'granted'

  return { requestAudioPermission, isAudioPermitted }
}
