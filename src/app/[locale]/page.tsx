'use client'
import { useTranslations } from 'next-intl'
import Button from './components/Button'
import { Link } from '@/src/navigation' // Import Link component

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
            'File_Converter_is_a_powerful_software_that_easily_converts_files_between_different_formats_such_as_PNG_to_JPEG_With_a_simple_interface_File_Converter_ensures_quick_high_quality_conversions_for_all_your_files_whether_for_web_optimization_or_other_application'
          )}
        </div>
        <div className='mt-4 flex flex-row gap-4'>
          <Link href='/Converter/ImageConverter'>
            {' '}
            {/* Use Link component */}
            <Button rounded size='large'>
              {t('Image_Converter')}
            </Button>
          </Link>
        </div>
      </section>
      <section className='bg-background-secondary py-20 max-lg:py-10'>
        <div className='mx-auto grid max-w-screen-lg grid-cols-1 gap-7 px-8 py-5 max-lg:max-w-fit max-lg:grid-cols-1 max-lg:gap-10'>
          <div className='text-center'>
            <h2 className='mb-3 text-xl font-semibold'>
              {t('Image_Converter')}
            </h2>
            <p className='text-text-secondary max-lg:max-w-[500px]'>
              {t(
                'Convert_image_files_to_various_formats_includin_JPG_JPEG_PNG_GIF_WEBP_TIFF_BMP_RAW_and_ICO'
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
