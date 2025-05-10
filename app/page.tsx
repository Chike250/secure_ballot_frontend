import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { AiAssistantPreview } from "@/components/ai-assistant-preview"
import { LanguageModal } from "@/components/language-modal"
import { LanguageProvider } from "@/lib/i18n/LanguageContext"
import { TranslatedHomePage } from "@/components/translated-home-page"

export const metadata: Metadata = {
  title: "Secure Ballot - Nigeria's Secure Voting Platform",
  description:
    "Nigeria's most secure and transparent voting platform for the 2027 General Elections. Vote securely from anywhere.",
  keywords: "Nigeria, voting, election, secure ballot, transparent voting, 2027 elections",
}

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Navbar />
        <TranslatedHomePage />
        <LanguageModal />
        <AiAssistantPreview />
      </div>
    </LanguageProvider>
  )
}
