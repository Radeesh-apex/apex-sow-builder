import React, { createContext, useContext, useState, useMemo } from 'react'
import { en, ta, es, fr, de } from './locales'
import type { Translations } from './locales'

export type LocaleKey = 'en' | 'ta' | 'es' | 'fr' | 'de'

export interface LocaleOption {
  id: LocaleKey
  label: string
  flag: string
}

const LOCALE_MAP: Record<LocaleKey, Translations> = { en, ta, es, fr, de }

export const LOCALE_OPTIONS: LocaleOption[] = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

interface I18nContextValue {
  locale: LocaleKey
  setLocale: (l: LocaleKey) => void
  t: Translations
  localeOptions: LocaleOption[]
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => undefined,
  t: en,
  localeOptions: LOCALE_OPTIONS,
})

export function useI18n(): I18nContextValue {
  return useContext(I18nContext)
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleKey>(() => {
    const saved = localStorage.getItem('apex-locale') as LocaleKey | null
    return saved && saved in LOCALE_MAP ? saved : 'en'
  })

  const ctx = useMemo<I18nContextValue>(
    () => ({
      locale,
      localeOptions: LOCALE_OPTIONS,
      t: LOCALE_MAP[locale],
      setLocale: (l) => {
        setLocaleState(l)
        localStorage.setItem('apex-locale', l)
      },
    }),
    [locale],
  )

  return <I18nContext.Provider value={ctx}>{children}</I18nContext.Provider>
}
