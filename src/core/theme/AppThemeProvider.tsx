import React, { createContext, useContext, useState, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import type { Theme } from '@mui/material/styles'
import { darkTheme, corporateBlueTheme } from './themes'

// Restrict to your two active corporate themes
export type ThemePreset = 'corporateBlue' | 'dark'

export interface ThemePresetOption {
  id: ThemePreset
  label: string
  primaryColor: string
}

// Cleaned up options list to map exactly to what's available
export const THEME_PRESETS: ThemePresetOption[] = [
  { id: 'corporateBlue', label: 'Corporate Light', primaryColor: '#3b4b61' },
  { id: 'dark', label: 'Corporate Dark', primaryColor: '#94a3b8' },
]

const themeMap: Record<ThemePreset, Theme> = {
  corporateBlue: corporateBlueTheme,
  dark: darkTheme,
}

interface ThemeContextValue {
  activeTheme: ThemePreset
  setTheme: (preset: ThemePreset) => void
  themePresets: ThemePresetOption[]
}

const ThemeContext = createContext<ThemeContextValue>({
  activeTheme: 'corporateBlue',
  setTheme: () => undefined,
  themePresets: THEME_PRESETS,
})

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

export function AppThemeProvider({
  children,
  defaultTheme = 'corporateBlue',
}: {
  children: React.ReactNode
  defaultTheme?: ThemePreset
}) {
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem('apex-theme') as ThemePreset | null
    // Safety fallback: if a user has an old theme key stored in their browser, reset them safely to corporateBlue
    return saved && saved in themeMap ? saved : defaultTheme
  })

  const ctx = useMemo<ThemeContextValue>(
    () => ({
      activeTheme,
      themePresets: THEME_PRESETS,
      setTheme: (preset) => {
        setActiveTheme(preset)
        localStorage.setItem('apex-theme', preset)
      },
    }),
    [activeTheme],
  )

  return (
    <ThemeContext.Provider value={ctx}>
      <MuiThemeProvider theme={themeMap[activeTheme]}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}