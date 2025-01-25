import { Box, Button, Flex, Text, TextField } from '@radix-ui/themes'
import { Form, json, useActionData, useNavigate } from '@remix-run/react'
import { ActionFunctionArgs } from 'react-router'

import { password, token } from '@/auth'
import { useEffect } from 'react'

type ActionData = {
  error?: boolean
  message?: string
  token?: string
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()

  if (body.get('password') !== password) {
    return {
      error: true,
      message: 'Incorrect password',
    }
  }

  return json({
    token: token,
  })
}

export default function Login() {
  const navigate = useNavigate()
  const actionData = useActionData<ActionData>()

  useEffect(() => {
    if (actionData?.token) {
      localStorage.setItem('token', actionData.token)
      navigate('/', { replace: true })
    }
  }, [actionData, navigate])

  return (
    <Form method="post" className="space-y-4">
      <Flex align="center" justify="center" direction="column" height="100vh">
        <Box width="250px">
          <Flex direction="column" gap="2">
            <TextField.Root name="password" type="password" size="1" placeholder="Enter password" />

            <Button type="submit">Login</Button>

            {actionData?.message && <Text color="red">{actionData?.message}</Text>}
          </Flex>
        </Box>
      </Flex>
    </Form>
  )
}
