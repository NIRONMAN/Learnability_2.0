"use client"

type Props = {
  objectUrl: string
}

const PdfViewer = ({ objectUrl }: Props) => {
  return (
    <div className='h-full'>
      <div className='h-full'>
        <iframe
          src={`${objectUrl}#toolbar=1`}
          style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            width: '100%',
            height: '100%',
          }}
          title="PDF Viewer"
        />
      </div>
    </div>
  )
}

export default PdfViewer