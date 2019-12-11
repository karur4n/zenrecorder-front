import { formatSecondsToDurationString } from './formatSeconds'

test('40秒をフォーマットして "00:00:40" になる', () => {
  expect(formatSecondsToDurationString(40)).toEqual('00:00:40')
})
