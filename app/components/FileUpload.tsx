import { Box, Button, Flex, Text } from '@radix-ui/themes'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

type Props = {
  file: File | null
  onFileChange: (file: File | null) => void
}

export default function FileUpload({ file, onFileChange }: Props) {
  // const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileChange(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/x-edf': ['.edf'],
    },
  })

  return (
    <Box>
      <Flex
        {...getRootProps()}
        direction="column"
        align="center"
        justify="center"
        style={{
          padding: '20px',
          border: '2px dashed var(--gray-6)',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'var(--gray-3)' : 'transparent',
        }}>
        <input {...getInputProps()} />
        <Text size="2" mb="2">
          {isDragActive
            ? 'Drop the EDF file here'
            : 'Drag & drop EDF files here, or click to select files'}
        </Text>
        <Button size="1" variant="soft">
          Select Files
        </Button>
      </Flex>

      {/* {files.length > 0 && (
        <Box mt="3">
          <Text size="2" mb="2">
            Selected files:
          </Text>
          {files.map((file, index) => (
            <Text key={index} size="1" color="gray">
              {file.name}
            </Text>
          ))}
        </Box>
      )} */}
    </Box>
  )
}
