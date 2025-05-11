"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage, languages, type LanguageCode } from "@/lib/i18n/LanguageContext"
import { useToast } from "@/hooks/use-toast"

interface LanguageSelectorProps {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
}

export function LanguageSelector({
  variant = "outline",
  size = "icon",
  showText = false,
  className,
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage()
  const { toast } = useToast()
  const [isChanging, setIsChanging] = useState(false)

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    if (newLanguage === language) return

    setIsChanging(true)

    // Simulate a small delay to show loading state
    setTimeout(() => {
      setLanguage(newLanguage)
      setIsChanging(false)

      toast({
        title: t("settings.language.languageChanged"),
        description: t(`languages.${newLanguage}`),
      })
    }, 300)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isChanging}>
          <Globe className={`h-4 w-4 ${isChanging ? "animate-spin" : ""}`} />
          {showText && (
            <span className="ml-2">
              {languages[language].flag} {t(`languages.${language}`)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, { name, nativeName, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as LanguageCode)}
            className={language === code ? "bg-muted" : ""}
          >
            <span className="mr-2">{flag}</span>
            <span>{nativeName}</span>
            <span className="ml-2 text-muted-foreground">({name})</span>
            {language === code && <Check className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Import Check icon
import { Check } from "lucide-react"
