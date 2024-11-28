'use client'
import { ChangeEvent, DragEvent, useMemo, useState } from 'react'
import Button from '@/src/app/[locale]/components/Button'
import { useTranslations } from 'next-intl'

const calculateMarginLeft = (fileName: string): string => {
  const length = fileName.length
  if (length === 0) return '30%'
  if (length < 10) return '55%'
  if (length < 15) return '60%'
  if (length < 17) return '30%'
  if (length < 22) return '15%'
  return '0%'
}

const truncateFileName = (fileName: string, maxLength: number): string => {
  const extensionIndex = fileName.lastIndexOf('.')
  const extension =
    extensionIndex !== -1 ? fileName.substring(extensionIndex) : ''
  const baseName =
    extensionIndex !== -1 ? fileName.substring(0, extensionIndex) : fileName

  if (fileName.length <= maxLength) {
    return fileName
  } else {
    const truncatedBaseName = baseName.substring(
      0,
      maxLength - extension.length - 3
    )
    return `${truncatedBaseName}...${extension}`
  }
}

const getCompatibleAudioFormats = (fileType: string) => {
  const audioFormats = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma']
  return fileType.startsWith('audio') ? audioFormats : []
}

const createAudioFileName = (baseName: string, format: string) => {
  return `${baseName}.${format}`
}

const processAudioForConversion = (
  file: File,
  format: string,
  baseName: string,
  callback: (blob: Blob | null) => void
) => {
  const reader = new FileReader()
  reader.onload = () => {
    const arrayBuffer = reader.result as ArrayBuffer
    callback(
      new Blob([new Uint8Array(arrayBuffer)], { type: `audio/${format}` })
    )
  }
  reader.readAsArrayBuffer(file)
}

const handleAudioProcessing = (
  file: File,
  selectedFormat: string,
  fileName: string,
  callback: (blob: Blob | null) => void
) => {
  const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName
  processAudioForConversion(file, selectedFormat, baseName, callback)
}

const AudioConverter = () => {
  const t = useTranslations('')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [selectedFormat, setSelectedFormat] = useState<string>('mp3')
  const [fileType, setFileType] = useState<string>('')

  const onFileLoad = (uploadedFile: File) => {
    setFile(uploadedFile)
    setFileName(truncateFileName(uploadedFile.name, 20))
    setFileType(uploadedFile.type)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    const fileType = uploadedFile.type
    if (!getCompatibleAudioFormats(fileType)?.length) {
      alert(t('Unsupported file type. Please upload a valid audio file.'))
      return
    }

    onFileLoad(uploadedFile)
  }

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const uploadedFile = e.dataTransfer.files?.[0]
    if (!uploadedFile) return

    if (!getCompatibleAudioFormats(uploadedFile.type)?.length) {
      alert(t('Unsupported file type. Please upload a valid audio file.'))
      return
    }

    onFileLoad(uploadedFile)
  }

  const handleConvert = () => {
    if (!file || !fileName) return

    const baseName =
      fileName.substring(0, fileName.lastIndexOf('.')) || fileName
    handleAudioProcessing(file, selectedFormat, fileName, blob => {
      if (blob) {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = createAudioFileName(baseName, selectedFormat)
        link.click()
      }
    })
  }

  const selectOptions = useMemo(
    () =>
      getCompatibleAudioFormats(fileType).map(format => (
        <option key={format} value={format}>
          {format}
        </option>
      )),
    [fileType]
  )

  return (
    <div className='mt-24 flex flex-col items-center p-10'>
      <main className='flex flex-col gap-6 text-center'>
        <div
          className='relative flex h-[300px] w-full max-w-[30rem] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-4'
          onDrop={handleFileDrop}
          onDragOver={e => e.preventDefault()}
          role='button'
          tabIndex={0}
          aria-label={t('Drop or upload a file')}
        >
          <div className='mt-4 flex w-full items-center justify-center'>
            <input
              type='file'
              accept='audio/*'
              className='block cursor-pointer bg-transparent text-center'
              onChange={handleFileUpload}
              style={{ marginLeft: calculateMarginLeft(fileName) }}
            />
          </div>
          {!file && (
            <div className='flex items-center justify-center'>
              <span>{t('or_drop_a_file')}</span>
            </div>
          )}
          {file && (
            <div className='relative flex items-center justify-center overflow-hidden'>
              {fileType.startsWith('audio') && (
                <audio
                  controls
                  className='max-h-[80%] max-w-[80%] rounded-lg object-contain'
                >
                  <source src={URL.createObjectURL(file)} type={fileType} />
                </audio>
              )}
            </div>
          )}
        </div>

        {file && fileName && (
          <div className='text-center'>
            <a
              href={URL.createObjectURL(file)}
              target='_blank'
              rel='noopener noreferrer'
              className='underline'
            >
              {t('View_File')}
            </a>
          </div>
        )}

        {fileType.startsWith('audio') && (
          <div className='font-mono'>
            <div className='mt-4'>
              <label htmlFor='fileFormat'>{t('Choose_a_format')}</label>
              <select
                id='fileFormat'
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value)}
                className='mt-3 w-full rounded-lg border p-2'
              >
                {selectOptions}
              </select>
            </div>

            <div className='mt-6 flex flex-row justify-center gap-4'>
              <Button rounded size='large' onClick={handleConvert}>
                {t('Convert')}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AudioConverter
