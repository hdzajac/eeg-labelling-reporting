import { Flex } from '@radix-ui/themes'
import { EdfDecoder } from 'edfdecoder'
import { useEffect, useState } from 'react'

import ClinicalInfo from '@/components/ClinicalInfo'
import { EEGTimelineEditor } from '@/components/EEGTimelineEditor'
import FileUpload from '@/components/FileUpload'
import Header from '@/components/Header'
import Report from '@/components/Report'
import { useEDFStore } from '@/store/edf'

export default function Index() {
  const [file, setFile] = useState<File | null>(null)
  const { edf, setEDF } = useEDFStore()

  useEffect(() => {
    const decoder = new EdfDecoder()

    const reader = new FileReader()
    if (!file) {
      return
    }
    reader.onloadend = function (event) {
      const buffer = event.target?.result
      decoder.setInput(buffer)
      decoder.decode()
      const output = decoder.getOutput()

      setEDF(output)
    }

    reader.readAsArrayBuffer(file)
  }, [file])

  return (
    <Flex style={{ backgroundColor: 'var(--surface)' }} height="100vh" direction="column">
      <Flex gap="2" direction="column" width="1200px" ml="auto" mr="auto" pb="6">
        <Header />

        {!edf ? (
          <FileUpload file={file} onFileChange={setFile} />
        ) : (
          <>
            <ClinicalInfo />
            <EEGTimelineEditor />
            <Report />
          </>
        )}
      </Flex>
    </Flex>
  )
}
