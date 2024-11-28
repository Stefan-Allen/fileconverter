'use client'
import { Link } from '@/src/navigation'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import ThemeSwitch from './ThemeSwitch'

interface Props {
  locale: string
}

export const Header: FC<Props> = ({ locale }) => {
  const t = useTranslations('')
  return (
    <div className='mx-auto flex max-w-screen-2xl flex-row items-center justify-between p-5'>
      <Link lang={locale} href='/'>
        <div className='size mx-2 flex select-none flex-row items-center text-xl font-bold'>
          {t('File_Converter')}
        </div>
      </Link>
      <div className='flex flex-row items-center gap-3'>
        <nav className='mr-10 inline-flex gap-5'>
          <Link lang={locale} href={`/Converter/AudioConverter`}>
            {t('Audio_Converter')}
          </Link>
          <Link lang={locale} href={`/Converter/ImageConverter`}>
            {t('Image_Converter')}
          </Link>
        </nav>
        <ThemeSwitch />
        {/* <LangSwitcher /> */}

        <a
          href='https://github.com/yahyaparvar/nextjs-template'
          target='_blank'
        ></a>
      </div>
    </div>
  )
}
