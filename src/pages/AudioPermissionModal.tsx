import React from 'react'
import Modal from 'react-modal'
import microphoneImage from '../assets/images/microphone.png'

Modal.setAppElement('#modal-root')

type Props = {
  isOpen: boolean
}

export const AudioPermissionModal: React.FC<Props> = ({ isOpen }) => {
  return (
    <Modal isOpen={isOpen}>
      <p>マイクのパーミッションを許可してください</p>
      <img src={microphoneImage} width={240} />
    </Modal>
  )
}

Modal.defaultStyles.overlay = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
}

Modal.defaultStyles.content = {
  backgroundColor: 'white',
  border: '1px solid #f1f3f5',
  borderRadius: '4px',
  outline: 'none',
  maxHeight: '90%',
  overflow: 'scroll',
  padding: '16px',
}
