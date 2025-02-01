import { Box, Flex } from '@radix-ui/themes'
import { EdfDecoder } from 'edfdecoder'
import { useEffect, useRef, useState } from 'react'

import useAnnotationsStore, { Annotation } from '@/store/annotations'
import AnnotationsTimeline from './AnnotationsTimeline'
import EEGViewer from './EEGViewer'

export function EEGTimelineEditor() {
  const [edf, setEdf] = useState(null)
  const { annotations, setAnnotations } = useAnnotationsStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const decoder = new EdfDecoder()

  useEffect(() => {
    function handleInput(e: Event) {
      const files = e.target?.files
      const reader = new FileReader()

      if (!files.length) {
        return
      }

      reader.onloadend = function (event) {
        const buffer = event.target?.result

        decoder.setInput(buffer)
        decoder.decode()
        const output = decoder.getOutput()

        setEdf(output)
      }

      reader.readAsArrayBuffer(files[0])
    }

    // Everything around if statement
    if (inputRef && inputRef.current) {
      inputRef.current.addEventListener('change', handleInput)

      return () => {
        inputRef.current?.removeEventListener('change', handleInput)
      }
    }
  }, [inputRef])

  if (!edf) {
    return (
      <Box>
        <input ref={inputRef} type="file" id="fileInput" />
      </Box>
    )
  }

  const handleAddAnnotation = (ann: Annotation) => {
    setAnnotations([...annotations, ann])
  }

  const handleDeleteAnnotation = (ann: Annotation) => {
    setAnnotations(annotations.filter((a) => a !== ann))
  }

  const handleUpdateAnnotation = (ann: Annotation) => {
    setAnnotations(annotations.map((a) => (a === ann ? ann : a)))
  }

  return (
    <Flex direction="column" gap="2">
      <EEGViewer edf={edf} onAnnotationAdd={handleAddAnnotation} />
      <AnnotationsTimeline
        edf={edf}
        annotations={annotations}
        onAnnotationAdd={handleAddAnnotation}
        onAnnotationDelete={handleDeleteAnnotation}
        onAnnotationUpdate={handleUpdateAnnotation}
      />
    </Flex>
  )
}
