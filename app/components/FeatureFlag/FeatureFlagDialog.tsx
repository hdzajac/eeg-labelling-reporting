import { Box, Button, Dialog, Flex, Tabs } from '@radix-ui/themes'
import { Settings } from 'lucide-react'
import { useForm } from 'react-hook-form'

import InterfacePanel from './InterfacePanel'
import PromptPanel from './PromptPanel'
import { defaultFlags, useFlags } from './useFlags'

type Props = {}

export default function FeatureFlagDialog({}: Props) {
  const { update, reset, flags } = useFlags()

  const {
    register,
    handleSubmit,
    control,
    reset: RHFReset,
  } = useForm({
    defaultValues: flags,
  })

  const handleReset = () => {
    reset()
    RHFReset(defaultFlags)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost">
          <Settings size={20} color="white" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="650px" aria-describedby={undefined}>
        <Dialog.Title>Feature flags</Dialog.Title>

        <form onSubmit={handleSubmit(update)}>
          <Tabs.Root defaultValue="prompt">
            <Tabs.List>
              <Tabs.Trigger value="prompt">Prompt</Tabs.Trigger>
              <Tabs.Trigger value="ui">UI</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="prompt">
                <PromptPanel control={control} />
              </Tabs.Content>

              <Tabs.Content value="ui">
                <InterfacePanel control={control} />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
          <Flex justify="between" mt="4">
            <Dialog.Close>
              <Button variant="soft" color="gray" onClick={handleReset}>
                Reset
              </Button>
            </Dialog.Close>
            <Flex gap="3" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button type="submit">Save</Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
