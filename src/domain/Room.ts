export type Room = {
  id: string
  users: Array<{
    id: string
    name: string
  }>
  status: string
  recordingStartedAt: Date
}
