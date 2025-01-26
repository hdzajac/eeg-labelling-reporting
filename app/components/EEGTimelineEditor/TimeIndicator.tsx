import { formatTime } from '@/utils'
import { Flex, Text } from '@radix-ui/themes'

type Props = {
  interval: number
  startTime: number
}

export default function TimeIndicator({ interval, startTime }: Props) {
  return (
    <Flex>
      {Array.from({ length: interval }).map((_, index) => (
        <Flex key={index} justify="between" width="100%">
          <Text size="1" style={{ color: 'var(--gray-9)' }}>
            {formatTime(startTime + index)}
          </Text>
        </Flex>
      ))}
    </Flex>
  )
}
