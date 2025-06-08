"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from "react"

// Import all language files
import en from "./translations/en"
import ha from "./translations/ha"
import yo from "./translations/yo"
import ig from "./translations/ig"
import pcm from "./translations/pcm"

// Define available languages
export const languages = {
  en: { name: "English", nativeName: "English", flag: "🇬🇧" },
  ha: { name: "Hausa", nativeName: "هَوُسَ", flag: "🇳🇬" },
  yo: { name: "Yoruba", nativeName: "Èdè Yorùbá", flag: "🇳🇬" },
  ig: { name: "Igbo", nativeName: "Asụsụ Igbo", flag: "🇳🇬" },
  pcm: { name: "Nigerian Pidgin", nativeName: "Naija Pidgin", flag: "🇳🇬" },
}

// Define language translations
const translations = {
  en,
  ha,
  yo,
  ig,
  pcm,
}

export type LanguageCode = keyof typeof languages
type TranslationKey = string
type TranslationParams = Record<string, string | number>

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: TranslationKey, params?: TranslationParams) => string
  languages: typeof languages
  isRtl: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  languages,
  isRtl: false,
})

interface LanguageProviderProps {
  children: ReactNode
  defaultLanguage?: LanguageCode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, defaultLanguage = "en" }) => {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage)
  const [isRtl, setIsRtl] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize language from localStorage or browser settings on client side
  useEffect(() => {
    if (!isClient) return

    try {
      const storedLanguage = localStorage.getItem("language") as LanguageCode | null

      if (storedLanguage && Object.keys(languages).includes(storedLanguage)) {
        setLanguageState(storedLanguage)
      } else if (navigator && navigator.language) {
        // Try to detect browser language
        const browserLanguage = navigator.language.split("-")[0] as LanguageCode
        if (Object.keys(languages).includes(browserLanguage)) {
          setLanguageState(browserLanguage)
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage or navigator:", error)
    }
  }, [isClient])

  // Update RTL status when language changes
  useEffect(() => {
    if (!isClient) return

    // Currently only Hausa might need RTL support in the future
    setIsRtl(language === "ha")

    try {
      // Save language preference to localStorage
      localStorage.setItem("language", language)

      // Update HTML lang attribute
      document.documentElement.lang = language

      // Update dir attribute for RTL support
      document.documentElement.dir = isRtl ? "rtl" : "ltr"
    } catch (error) {
      console.error("Error updating document or localStorage:", error)
    }
  }, [language, isRtl, isClient])

  // Function to set language
  const setLanguage = (newLanguage: LanguageCode) => {
    if (Object.keys(languages).includes(newLanguage)) {
      setLanguageState(newLanguage)
    }
  }

  // Translation function
  const t = (key: TranslationKey, params?: TranslationParams): string => {
    // Split the key by dots to access nested properties
    const keys = key.split(".")

    // Get the current language translations
    let translation: any = translations[language]

    // Navigate through the nested properties
    for (const k of keys) {
      translation = translation?.[k]
      if (!translation) break
    }

    // If translation not found, fallback to English or return the key
    if (!translation) {
      let fallback: any = translations.en
      for (const k of keys) {
        fallback = fallback?.[k]
        if (!fallback) break
      }
      translation = fallback || key
    }

    // Replace parameters if provided
    if (params && typeof translation === "string") {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue))
      }, translation)
    }

    return translation || key
  }

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    return { language, setLanguage, t, languages, isRtl }
  }, [language, isRtl])

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  return context
}
