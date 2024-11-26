'use client'
import { ChangeEvent, DragEvent, useState } from 'react'
import Button from '@/src/app/[locale]/components/Button'
import { useTranslations } from 'next-intl'

interface Dimensions {
  width: number | null
  height: number | null
}

const MAX_DIMENSION = 5000

const validateDimension = (
  value: number,
  fallback: number | null
): number | null => {
  if (value >= 1 && value <= MAX_DIMENSION) return value
  return fallback
}

const calculateMarginLeft = (fileName: string): string => {
  const length = fileName.length
  if (length === 0) return '30%'
  if (length < 10) return '30%'
  if (length < 15) return '15%'
  if (length < 17) return '10%'
  return '0%'
}

const getNewFileName = (
  baseName: string,
  width: number,
  height: number,
  format: string
): string => `${baseName}_${width}x${height}.${format}`

const getCompatibleFormats = (fileType: string) => {
  const imageFormats = [
    'png',
    'jpg',
    'jpeg',
    'webp',
    'gif',
    'tiff',
    'bmp',
    'raw',
    'ico'
  ]
  if (fileType.startsWith('image')) return imageFormats
  return []
}

const ImageConverter = () => {
  const t = useTranslations('')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('current')
  const [selectedFormat, setSelectedFormat] = useState<string>('png')
  const [customDimensions, setCustomDimensions] = useState<Dimensions>({
    width: null,
    height: null
  })
  const [originalDimensions, setOriginalDimensions] = useState<Dimensions>({
    width: null,
    height: null
  })
  const [fileType, setFileType] = useState<string>('')

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    const fileType = uploadedFile.type
    const compatibleFormats = getCompatibleFormats(fileType)

    if (!compatibleFormats.length) {
      alert('Unsupported file type. Please upload a valid image.')
      return
    }

    setFile(uploadedFile)
    setFileName(uploadedFile.name)
    setFileType(fileType)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      const baseName =
        fileName.substring(0, fileName.lastIndexOf('.')) || fileName

      if (selectedSize === 'current') {
        width = originalDimensions.width || img.width
        height = originalDimensions.height || img.height
      } else if (selectedSize !== 'custom') {
        ;[width, height] = selectedSize.split('x').map(Number)
      } else {
        width = customDimensions.width || img.width
        height = customDimensions.height || img.height
      }

      canvas.width = width * 2
      canvas.height = height * 2

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.scale(2, 2)
        ctx.drawImage(img, 0, 0, width, height)

        const newFileName = getNewFileName(
          baseName,
          width,
          height,
          selectedFormat
        )

        canvas.toBlob(
          blob => {
            if (blob) {
              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.download = newFileName
              link.click()
            }
          },
          `image/${selectedFormat}`,
          0.95
        )
      }
    }
  }

  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedSize(value)

    if (value === 'current') {
      setCustomDimensions(originalDimensions)
    } else if (value !== 'custom') {
      setCustomDimensions({ width: null, height: null })
    }
  }

  const handleCustomDimensionChange =
    (key: keyof Dimensions) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = validateDimension(
        Number(e.target.value),
        originalDimensions[key]
      )
      setCustomDimensions(prev => ({ ...prev, [key]: value }))
    }

  const handleFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(e.target.value)
  }

  const handleConvert = () => {
    if (!file || !fileName) return

    const baseName =
      fileName.substring(0, fileName.lastIndexOf('.')) || fileName
    const compatibleFormats = getCompatibleFormats(fileType)
    if (!compatibleFormats.includes(selectedFormat)) {
      alert(
        `Invalid format for this file type. Please select a compatible format.`
      )
      return
    }

    if (fileType.startsWith('image')) {
      const img = new Image()
      img.src = URL.createObjectURL(file)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (selectedSize === 'current') {
          width = originalDimensions.width || img.width
          height = originalDimensions.height || img.height
        } else if (selectedSize !== 'custom') {
          ;[width, height] = selectedSize.split('x').map(Number)
        } else {
          width = customDimensions.width || img.width
          height = customDimensions.height || img.height
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)

          const newFileName = getNewFileName(
            baseName,
            width,
            height,
            selectedFormat
          )

          canvas.toBlob(blob => {
            if (blob) {
              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.download = newFileName
              link.click()
            }
          }, `image/${selectedFormat}`)
        }
      }
    }
  }

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const uploadedFile = e.dataTransfer.files[0]
    if (!uploadedFile) return

    const fileType = uploadedFile.type
    const compatibleFormats = getCompatibleFormats(fileType)

    if (!compatibleFormats.length) {
      alert('Unsupported file type.')
      return
    }

    setFile(uploadedFile)
    setFileName(uploadedFile.name)
    setFileType(fileType)

    const url = URL.createObjectURL(uploadedFile)
    const img = new Image()

    if (fileType.startsWith('image')) {
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setCustomDimensions({ width: img.width, height: img.height })
      }
      img.src = url
    }
  }

  return (
    <div className='mt-24 flex flex-col items-center p-10'>
      <main className='flex flex-col gap-6 text-center'>
        <div
          className='relative flex h-[300px] w-full max-w-[30rem] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-4'
          onDrop={handleFileDrop}
          onDragOver={e => e.preventDefault()}
          role='button'
          tabIndex={0}
          aria-label='Drop or upload a file'
        >
          <input
            type='file'
            accept='image/png,image/jpeg,image/jpg,image/webp,image/gif,image/tiff,image/bmp,image/raw,image/ico'
            className='mt-4 block cursor-pointer bg-transparent text-center'
            onChange={handleFileUpload}
            style={{ marginLeft: calculateMarginLeft(fileName) }}
          />
          {!file && <span>{t('or_drop_a_file')}</span>}
          {file && (
            <div className='relative flex h-full w-full items-center justify-center overflow-hidden'>
              {fileType.startsWith('image') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt='Preview'
                  className='max-h-[80%] max-w-[80%] rounded-lg object-contain'
                />
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

        {fileType.startsWith('image') && (
          <div className='font-mono'>
            <label htmlFor='imageSize'>{t('Choose_a_size')}</label>
            <select
              id='fileSize'
              className='mt-3 w-full rounded-lg border p-2'
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value='current'>{t('Current_Size')}</option>
              <option value='1024x1024'>1024x1024</option>
              <option value='2048x2048'>2048x2048</option>
              <option value='custom'>{t('Custom')}</option>
            </select>

            {selectedSize === 'custom' && (
              <div className='mt-4 flex flex-col items-center gap-4'>
                <div className='flex gap-4'>
                  <div>
                    <label htmlFor='width'>{t('Width')}</label>
                    <input
                      id='width'
                      type='number'
                      value={customDimensions.width || ''}
                      onChange={handleCustomDimensionChange('width')}
                      className='rounded-lg border p-2'
                    />
                  </div>
                  <div>
                    <label htmlFor='height'>{t('Height')}</label>
                    <input
                      id='height'
                      type='number'
                      value={customDimensions.height || ''}
                      onChange={handleCustomDimensionChange('height')}
                      className='rounded-lg border p-2'
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='mt-4'>
              <label htmlFor='fileFormat'>{t('Choose_a_format')}</label>
              <select
                id='fileFormat'
                value={selectedFormat}
                onChange={handleFormatChange}
                className='mt-3 w-full rounded-lg border p-2'
              >
                {getCompatibleFormats(fileType).map(format => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
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

export default ImageConverter
