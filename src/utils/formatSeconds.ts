/**
 * 90秒のとき 00:01:30 に
 * 40秒のとき 00:00:40 のようにフォーマットする
 */
export function formatSecondsToDurationString(seconds: number): string {
  const hoursString = Math.floor(seconds / (60 * 60))
    .toString()
    .padStart(2, '0')

  const minutesString = Math.floor((seconds % (60 * 60)) / 60)
    .toString()
    .padStart(2, '0')

  const secondsString = Math.floor((seconds % (60 * 60)) % 60)
    .toString()
    .padStart(2, '0')

  return `${hoursString}:${minutesString}:${secondsString}`
}
