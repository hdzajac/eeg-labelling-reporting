import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { z } from 'zod'

import { authMiddleware } from '@/auth'
import generateReport from '@/prompt-generators/generateReport'

export const config = { runtime: 'nodejs' }

const GeneratorActions = z.enum(['GENERATE_REPORT'])

export async function action({ request }: ActionFunctionArgs) {
  return authMiddleware(request, async () => {
    const body = await request.json()

    if (!body.action || !body.payload) {
      return json({ error: 'Missing action or payload' }, { status: 400 })
    }

    try {
      let result
      switch (body.action) {
        case GeneratorActions.Enum.GENERATE_REPORT:
          return generateReport(body.payload, body.flags)
        default:
          return json({ error: 'Invalid action' }, { status: 400 })
      }
      return json(result)
    } catch (error) {
      return json({ error })
    }
  })
}
