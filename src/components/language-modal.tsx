"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useLanguage, languages, type LanguageCode } from "@/lib/i18n/LanguageContext"

export function LanguageModal() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore")

    if (!hasVisited) {
      setIsFirstVisit(true)
      setIsOpen(true)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  const handleLanguageChange = (value: LanguageCode) => {
    setSelectedLanguage(value)
  }

  const handleConfirm = () => {
    setLanguage(selectedLanguage)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.language.title")}
          </DialogTitle>
          <DialogDescription>{t("settings.language.description")}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange} className="space-y-3">
            {Object.entries(languages).map(([code, { name, nativeName, flag }]) => (
              <div key={code} className="flex items-center space-x-2">
                <RadioGroupItem value={code} id={`language-${code}`} />
                <Label htmlFor={`language-${code}`} className="flex items-center cursor-pointer">
                  <span className="mr-2 text-lg">{flag}</span>
                  <span className="font-medium">{nativeName}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({name})</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          {!isFirstVisit && (
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("common.cancel")}
            </Button>
          )}
          <Button onClick={handleConfirm}>{isFirstVisit ? t("common.continue") : t("common.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
