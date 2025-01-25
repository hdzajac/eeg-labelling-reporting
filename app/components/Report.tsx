import { Heading } from '@radix-ui/themes'

export default function Report() {
  return (
    <div className="panel">
      <Heading as="h2">EEG Report</Heading>
      <p>BrainCapture: A Medical Technology Company bringing affordable EEG to everyone</p>
      <p>
        Please be aware that this report is not a diagnosis but is input to support a diagnosis. The
        receiver of this report must be a trained medical professional.
      </p>

      <Heading as="h3" size="3">
        Patient information
      </Heading>
      <Heading as="h3" size="3">
        Machine operator
      </Heading>
      <Heading as="h3" size="3">
        EEG interpreter
      </Heading>
      <Heading as="h3" size="3">
        Patient status
      </Heading>
      <Heading as="h3" size="3">
        Patient history
      </Heading>
      <Heading as="h3" size="3">
        Techincal information
      </Heading>
      <Heading as="h2">EEG findings</Heading>
      <Heading as="h2">Conclusion</Heading>
    </div>
  )
}
