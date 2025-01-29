import { Flex } from '@radix-ui/themes'
import FeatureFlagDialog from './FeatureFlag/FeatureFlagDialog'

export default function Header() {
  return (
    <Flex align="center" justify="between">
      <Flex gap="2" p="4" pl="0">
        <a>Clinical Info</a>
        <a>Recording</a>
        <a>Report</a>
      </Flex>
      <FeatureFlagDialog />
    </Flex>
  )
}
