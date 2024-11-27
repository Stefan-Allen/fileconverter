'use client'
import { useTranslations } from 'next-intl'
import Button from './components/Button'
import { Link } from '@/src/navigation'

export default function DashboardPage() {
  const t = useTranslations('')
  return (
    <div>
      <section className='flex flex-col items-center justify-center py-24'>
        <h1 className='text-center text-6xl font-extrabold leading-tight'>
          <span className='bg-span-bg bg-clip-text '>
            {t('File_Converter')}
          </span>
        </h1>
        <div className='my-6 px-20 text-center text-xl text-text-secondary'>
          {t(
            'File_Converter_is_a_powerful_software_that_easily_converts_files_between_different_formats_such_as_PNG_to_JPEG_With_a_simple_interface'
          )}
        </div>
        <div className='mt-4 flex flex-row gap-4'>
          <Link href='/Converter/ImageConverter'>
            <Button rounded size='large'>
              {t('Image_Converter')}
            </Button>
          </Link>
          <Link href='/Converter/AudioConverter'>
            <Button rounded size='large'>
              {t('Audio_Converter')}
            </Button>
          </Link>
        </div>
      </section>
      <section className='bg-background-secondary py-20 max-lg:py-10'>
        <div className='mx-auto grid max-w-screen-lg grid-cols-2 gap-7 px-8 py-5 max-lg:max-w-fit max-lg:grid-cols-1 max-lg:gap-10'>
          <div className='text-center'>
            <h2 className='mb-3  text-xl font-semibold'>
              {t('File_Converter')}
            </h2>
            <p className='text-text-secondary max-lg:max-w-[500px]'>
              {t(
                'File_Converter_is_a_powerful_software_that_easily_converts_files_between_different_formats_such_as_PNG_to_JPEG_With_a_simple_interface'
              )}
            </p>
          </div>
          <div className='text-center'>
            <h2 className='mb-3 text-xl font-semibold'>
              {t('Audio_Converter')}
            </h2>
            <p className='text-text-secondary max-lg:max-w-[500px]'>
              {t(
                'Audio_Converter_is_a_powerful_software_that_easily_converts_files_between_different_formats_such_as_MP3_to_WAV_With_a_simple_interface'
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
