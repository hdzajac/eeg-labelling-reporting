import { Flex } from '@radix-ui/themes'
import { Link, useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/server-runtime'
import * as fs from 'node:fs'
import path from 'node:path'

// import Header from '@/components/Header'
import { MedicalRecord } from '@/store/types'

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const files = await fs.promises
      .readdir(path.resolve(process.cwd(), './app/data/cases'))
      .catch(() => [])

    const cases: any[] = []
    for await (const file of files) {
      try {
        const data = await fs.promises.readFile(
          path.resolve(process.cwd(), './app/data/cases/', file),
          'utf-8'
        )
        cases.push(JSON.parse(data))
      } catch (error) {
        console.log('error', error)
      }
    }
    return cases
  } catch (error) {
    return []
  }
}

export default function Cases() {
  const records = useLoaderData() as MedicalRecord[]

  return (
    <Flex style={{ backgroundColor: 'var(--surface)' }} height="100vh" direction="column">
      {/* <Header />
      <Flex direction="column" p="4">
        {records?.length > 0 ? (
          <Flex width="100%" gap="4" direction="column">
            {records.map((medCase, index) => (
              <Link
                style={{ display: 'block', textDecoration: 'none', color: 'var(--gray-12)' }}
                key={index}
                className="panel"
                to={`/cases/${medCase.id}`}>
                Case {medCase.id}
              </Link>
            ))}
          </Flex>
        ) : (
          <p>No cases found</p>
        )}
      </Flex> */}
    </Flex>
  )
}
